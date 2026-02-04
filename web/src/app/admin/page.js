"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [filter, setFilter] = useState('pending'); // 'all' or 'pending'

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(storedUser);

        // Strict Role Check: Redirect regular users away from admin panel
        if (user.role === 'user') {
            router.push('/proposal/step1');
            return;
        }

        setCurrentUser(user);

        // Only fetch data if authorized
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        // ... (truncated for brevity in repl, but standard pattern)
        try {
            const res = await fetch('/api/proposals', { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setProposals(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch proposals:", error);
        } finally {
            setLoading(false);
        }
    };

    // ... updateStatus ...

    // Filter Logic
    const filteredProposals = proposals.filter(p => {
        if (filter === 'all') return true;

        // If pending filter is active:
        if (currentUser?.role && currentUser.role !== 'super_admin' && currentUser.department) {
            // Department Admin: Show only if THEIR dept status is Pending
            const deptStatus = p.departmentApprovals?.[currentUser.department]?.status;
            return deptStatus === 'Pending';
        } else if (currentUser?.role === 'super_admin') {
            // Super Admin: Show if main status is Pending
            return p.status === 'Assessment Pending' || p.status === 'Pending';
        }
        return true;
    });

    const updateStatus = async (id, newStatus, department = null) => {
        const payload = department ? { department, status: newStatus } : { status: newStatus };
        try {
            setProposals(prev => prev.map(p => {
                if (p._id !== id) return p;
                if (department) {
                    return { ...p, departmentApprovals: { ...p.departmentApprovals, [department]: { status: newStatus } } };
                } else {
                    return { ...p, status: newStatus };
                }
            }));
            const res = await fetch(`/api/proposals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to update');
        } catch (err) {
            console.error(err);
            alert('Failed to save update to database');
            fetchProposals();
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header glass-panel">
                <button className="logout-btn" onClick={() => { localStorage.removeItem('currentUser'); router.push('/'); }}>Logout</button>
                <h1>Admin Dashboard</h1>
                {currentUser && <p className="welcome-text">Logged in as: <strong>{currentUser.username}</strong> ({currentUser.role})</p>}

                <div className="filter-tabs">
                    <button className={`tab-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Action Required</button>
                    <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Proposals</button>
                </div>
            </div>

            <div className="dashboard-content">
                {loading ? (
                    <p className="loading-text">Loading proposals...</p>
                ) : filteredProposals.length === 0 ? (
                    <div className="empty-state">
                        <p>No {filter === 'pending' ? 'pending' : ''} proposals found.</p>
                        {filter === 'pending' && <button className="btn-link" onClick={() => setFilter('all')}>View All History</button>}
                    </div>
                ) : (
                    <div className="proposals-grid">
                        {filteredProposals.map((proposal) => (
                            <div key={proposal._id} className="proposal-card glass-panel">
                                <div className="card-header">
                                    <span className={`status-badge ${proposal.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                                        {proposal.status || 'Pending Review'}
                                    </span>
                                    <span className="date">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                                </div>

                                <h3>{proposal.ownerName}</h3>
                                <p className="location">📍 {proposal.village}, {proposal.town}</p>
                                <p className="submitted-by-text">Submitted by: {proposal.submittedBy || 'Unknown'}</p>

                                <div className="details-grid">
                                    <div className="detail-item">
                                        <label>Survey No</label>
                                        <span>{proposal.surveyNo}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Type</label>
                                        <span>{proposal.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Floors</label>
                                        <span>{proposal.floors}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Area</label>
                                        <span>{proposal.area} sq.ft</span>
                                    </div>
                                </div>

                                <div className="documents-section">
                                    <h4>Attached Documents</h4>
                                    <div className="doc-links">
                                        {proposal.ownershipProofUrl && <a href={proposal.ownershipProofUrl} target="_blank" className="doc-link">📄 Ownership</a>}
                                        {proposal.buildingPlanUrl && <a href={proposal.buildingPlanUrl} target="_blank" className="doc-link">📐 Plan</a>}
                                        {proposal.idProofUrl && <a href={proposal.idProofUrl} target="_blank" className="doc-link">🆔 ID Proof</a>}
                                        {proposal.applicantPhotoUrl && <a href={proposal.applicantPhotoUrl} target="_blank" className="doc-link">👤 Photo</a>}
                                    </div>
                                </div>

                                {/* Department Approvals Matrix */}
                                <div className="dept-approvals">
                                    <h4>Department Clearances</h4>
                                    <div className="dept-grid">
                                        {proposal.departmentApprovals && Object.entries(proposal.departmentApprovals).map(([dept, data]) => (
                                            <div key={dept} className={`dept-item ${data.status.toLowerCase()}`}>
                                                <span className="dept-name">{dept.replace('_', ' ')}</span>
                                                <span className="dept-status">{data.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {/* Super Admin Actions */}
                                    {currentUser?.role === 'super_admin' && (
                                        <>
                                            <button className="btn-action approve" onClick={() => updateStatus(proposal._id, 'Approved')}>Final Approve</button>
                                            <button className="btn-action reject" onClick={() => updateStatus(proposal._id, 'Rejected')}>Final Reject</button>
                                        </>
                                    )}

                                    {/* Department Admin Actions */}
                                    {currentUser?.role !== 'super_admin' && currentUser?.role !== 'user' && currentUser?.department && (
                                        <>
                                            <button className="btn-action approve" onClick={() => updateStatus(proposal._id, 'Cleared', currentUser.department)}>Clear {currentUser.department}</button>
                                            <button className="btn-action reject" onClick={() => updateStatus(proposal._id, 'Objection', currentUser.department)}>Object</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .admin-page {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .admin-header {
            padding: 2rem;
            margin-bottom: 2rem;
            text-align: center;
            position: relative;
        }

        .logout-btn {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: transparent;
            border: 1px solid #ffcdd2;
            color: #d32f2f;
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
        }
        
        .logout-btn:hover {
            background: #ffebee;
        }

        .admin-header h1 {
            color: var(--primary-dark);
            margin-bottom: 0.5rem;
        }

        .proposals-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        .proposal-card {
            padding: 1.5rem;
            transition: transform 0.2s;
        }

        .proposal-card:hover {
            transform: translateY(-5px);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-badge.pending { background: #FFF3E0; color: #EF6C00; }
        .status-badge.approved { background: #E8F5E9; color: #2E7D32; }
        .status-badge.rejected { background: #FFEBEE; color: #C62828; }

        .date {
            font-size: 0.8rem;
            color: #888;
        }

        .location {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
            background: #fcfcfc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
        }

        .detail-item label {
            font-size: 0.7rem;
            color: #999;
            text-transform: uppercase;
        }

        .detail-item span {
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }

        .documents-section {
            margin-bottom: 1.5rem;
            background: #f0f4f8;
            padding: 0.8rem;
            border-radius: 8px;
        }

        .documents-section h4 {
            font-size: 0.8rem;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .doc-links {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .doc-link {
            font-size: 0.8rem;
            color: #1565C0;
            text-decoration: none;
            background: white;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            border: 1px solid #BBDEFB;
            transition: all 0.2s;
        }

        .doc-link:hover {
            background: #E3F2FD;
            border-color: #2196F3;
        }

        .card-actions {
            display: flex;
            gap: 1rem;
        }

        .btn-action {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
        }

        .btn-action.approve {
            background: #E8F5E9;
            color: #2E7D32;
        }

        .btn-action.approve:hover { background: #C8E6C9; }

        .btn-action.reject {
            background: #FFEBEE;
            color: #C62828;
        }

        .btn-action.reject:hover { background: #FFCDD2; }

        .dept-approvals {
            margin-top: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .dept-approvals h4 {
            font-size: 0.8rem;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .dept-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.5rem;
        }

        .dept-item {
            display: flex;
            flex-direction: column;
            padding: 0.5rem;
            border-radius: 6px;
            background: #f5f5f5;
            font-size: 0.8rem;
            border: 1px solid #eee;
        }

        .dept-item.pending { border-left: 3px solid #FF9800; }
        .dept-item.cleared { border-left: 3px solid #4CAF50; background: #E8F5E9; }
        .dept-item.objection { border-left: 3px solid #F44336; background: #FFEBEE; }

        .dept-name {
            font-weight: 600;
            text-transform: capitalize;
            color: #333;
        }

        .dept-status {
            font-size: 0.75rem;
            color: #666;
        }
        
        .submitted-by-text {
            font-size: 0.8rem;
            color: #888;
            margin-bottom: 0.5rem;
        }
        
        .welcome-text {
            color: #555;
            margin-bottom: 0.2rem;
        }

        .filter-tabs {
            margin-top: 1.5rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        .tab-btn {
            padding: 0.5rem 1.5rem;
            border: none;
            background: rgba(0,0,0,0.05);
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            color: #666;
            transition: all 0.2s;
        }

        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
        }

        .btn-link {
            background: none;
            border: none;
            color: var(--primary-color);
            text-decoration: underline;
            cursor: pointer;
            margin-top: 0.5rem;
        }
      `}</style>
        </div>
    );
}
