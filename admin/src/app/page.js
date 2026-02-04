"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewDoc, setViewDoc] = useState(null); // State for document viewer

  // Department-specific verification checklists
  const DEPARTMENT_CHECKLISTS = {
    revenue: ['Verify Survey Number matches records', 'Check Land Ownership (Patta/Chitta)', 'Validate Land Classification'],
    fire: ['Ensure 6m Road Width Access', 'Check Distance from Hydrants', 'Verify Building Setbacks'],
    local_body: ['Zoning Regulations Compliance', 'Building Plan Checking', 'Property Tax Clearance'],
    dtcp: ['Master Plan Compatibility', 'Layout Approval Verification', 'Parking Space Adequacy'],
    forest: ['Distance from Reserve Forest', 'Wildlife Corridor Impact', 'Eco-sensitive Zone Verification'],
    pwd: ['Water Body Encroachment Check', 'Structural Stability Certificate', 'Rainwater Harvesting Plan'],
    default: ['Verify All Submitted Documents', 'Site Inspection Completed', 'Risk Assessment Reviewed']
  };

  const [expandedId, setExpandedId] = useState(null);

  // Memoize docs array for viewer to prevent infinite loops, MUST be at top level
  // const docs = useMemo(() => viewDoc ? [viewDoc] : [], [viewDoc]);

  // New States for Header Controls
  const [reportFilter, setReportFilter] = useState('pending'); // 'pending' | 'completed' | 'rejected'
  const [searchTerm, setSearchTerm] = useState('');

  const [checkedCriteria, setCheckedCriteria] = useState({});
  const [viewedDocs, setViewedDocs] = useState({});

  useEffect(() => {
    // Reset checklist and viewed docs when overlay opens/closes
    if (!expandedId) {
      setCheckedCriteria({});
      setViewedDocs({});
    }
  }, [expandedId]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role === 'user') {
      alert("Unauthorized Access");
      localStorage.removeItem('currentUser');
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/proposals', { cache: 'no-store' });
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

  const updateStatus = async (id, newStatus, department = null, remarks = null) => {
    const payload = department ? { department, status: newStatus, remarks } : { status: newStatus };

    try {
      // Optimistic Update
      setProposals(prev => prev.map(p => {
        if (p._id !== id) return p;
        if (department) {
          return {
            ...p,
            departmentApprovals: {
              ...p.departmentApprovals,
              [department]: { status: newStatus, remarks: remarks || '' }
            }
          };
        } else {
          return { ...p, status: newStatus };
        }
      }));

      const res = await fetch(`http://localhost:3000/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Update failed with status: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
      fetchProposals(); // Revert on error
    }
  };

  const getDeptTitle = () => {
    if (!currentUser) return 'Admin';
    if (currentUser.department) {
      return currentUser.department.charAt(0).toUpperCase() + currentUser.department.slice(1);
    }
    return 'Super Admin';
  };

  const filteredProposals = proposals.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = !searchTerm ||
      p.ownerName?.toLowerCase().includes(searchLower) ||
      p.village?.toLowerCase().includes(searchLower) ||
      p.id?.toLowerCase().includes(searchLower);

    if (!searchMatch) return false;

    // Report Status Filter
    if (currentUser?.role && currentUser.role !== 'super_admin' && currentUser.department) {
      const status = p.departmentApprovals?.[currentUser.department]?.status;
      if (reportFilter === 'pending') return status === 'Pending';
      if (reportFilter === 'completed') return status === 'Cleared';
      if (reportFilter === 'rejected') return status === 'Objection' || status === 'Rejected';
    } else {
      if (reportFilter === 'pending') return p.status === 'Assessment Pending' || p.status === 'Pending';
      if (reportFilter === 'completed') return p.status === 'Approved';
      if (reportFilter === 'rejected') return p.status === 'Rejected';
    }
    return true;
  });

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-header glass-panel">
        <div className="header-left">
          <h1>{getDeptTitle()} Dashboard</h1>
          {currentUser && <span className="user-badge">{currentUser.username}</span>}
        </div>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search name, village, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('currentUser');
              router.push('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p className="loading-text">Loading data...</p>
        ) : filteredProposals.length === 0 ? (
          <div className="empty-state">
            <p>No {reportFilter} proposals found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="proposals-list">
            {filteredProposals.map((proposal) => (
              <div key={proposal._id} className="proposal-item glass-panel">
                <div className="item-header" onClick={() => setExpandedId(proposal._id)}>
                  <div className="header-info">
                    <span className="case-id-label">CASE ID</span>
                    <span className="case-id-val">{proposal.id || proposal._id}</span>
                  </div>
                  <div className="header-date">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL SCREEN OVERLAY FOR EXPANDED VIEW */}
      {expandedId && (() => {
        const selectedProposal = proposals.find(p => p._id === expandedId);
        if (!selectedProposal) return null;

        return (
          <div className="fullscreen-overlay">
            <div className="overlay-content">
              <button className="close-btn" onClick={() => setExpandedId(null)}>✕ Close View</button>

              <div className="overlay-header">
                <h2>Case ID: {selectedProposal.id || selectedProposal._id}</h2>
                <span className={`status-badge ${selectedProposal.status?.toLowerCase().replace(' ', '-')}`}>
                  {selectedProposal.status}
                </span>
              </div>

              <div className="item-body-split">
                {/* LEFT COLUMN */}
                <div className="split-left">
                  <h3>Application Details</h3>
                  <div className="form-grid">
                    <div className="form-group"><label>Applicant Name</label><input type="text" value={selectedProposal.ownerName} readOnly /></div>
                    <div className="form-group"><label>Contact</label><input type="text" value={selectedProposal.ownerContact} readOnly /></div>
                    <div className="form-group"><label>Type</label><input type="text" value={selectedProposal.type} readOnly /></div>
                    <div className="form-group"><label>Area (sq.ft)</label><input type="text" value={selectedProposal.area} readOnly /></div>
                    <div className="form-group"><label>Floors</label><input type="text" value={selectedProposal.floors} readOnly /></div>
                    <div className="form-group"><label>Survey No</label><input type="text" value={selectedProposal.surveyNo} readOnly /></div>
                    <div className="form-group"><label>Village</label><input type="text" value={selectedProposal.village} readOnly /></div>
                    <div className="form-group"><label>Taluk</label><input type="text" value={selectedProposal.taluk} readOnly /></div>
                  </div>

                  <h3>Attached Documents</h3>
                  <div className="doc-stack">
                    {selectedProposal.ownershipProofUrl && (
                      <button
                        className={`view-btn plain ${viewedDocs['ownershipProofUrl'] ? 'viewed' : ''}`}
                        onClick={() => {
                          setViewDoc({ uri: getFullUrl(selectedProposal.ownershipProofUrl) });
                          setViewedDocs(prev => ({ ...prev, 'ownershipProofUrl': true }));
                        }}
                      >
                        Ownership Proof {viewedDocs['ownershipProofUrl'] && '✓'}
                      </button>
                    )}
                    {selectedProposal.buildingPlanUrl && (
                      <button
                        className={`view-btn plain ${viewedDocs['buildingPlanUrl'] ? 'viewed' : ''}`}
                        onClick={() => {
                          setViewDoc({ uri: getFullUrl(selectedProposal.buildingPlanUrl) });
                          setViewedDocs(prev => ({ ...prev, 'buildingPlanUrl': true }));
                        }}
                      >
                        Building Plan {viewedDocs['buildingPlanUrl'] && '✓'}
                      </button>
                    )}
                    {selectedProposal.idProofUrl && (
                      <button
                        className={`view-btn plain ${viewedDocs['idProofUrl'] ? 'viewed' : ''}`}
                        onClick={() => {
                          setViewDoc({ uri: getFullUrl(selectedProposal.idProofUrl) });
                          setViewedDocs(prev => ({ ...prev, 'idProofUrl': true }));
                        }}
                      >
                        ID Proof {viewedDocs['idProofUrl'] && '✓'}
                      </button>
                    )}
                    {selectedProposal.applicantPhotoUrl && (
                      <button
                        className={`view-btn plain ${viewedDocs['applicantPhotoUrl'] ? 'viewed' : ''}`}
                        onClick={() => {
                          setViewDoc({ uri: getFullUrl(selectedProposal.applicantPhotoUrl) });
                          setViewedDocs(prev => ({ ...prev, 'applicantPhotoUrl': true }));
                        }}
                      >
                        Applicant Photo {viewedDocs['applicantPhotoUrl'] && '✓'}
                      </button>
                    )}
                  </div>

                  {currentUser?.role === 'super_admin' && (
                    <div className="dept-approvals">
                      <h3>Approvals Status</h3>
                      <div className="dept-grid">
                        {selectedProposal.departmentApprovals && Object.entries(selectedProposal.departmentApprovals).map(([dept, data]) => {
                          if (dept === 'horticulture' && data.status === 'Pending') return null;
                          return (
                            <div key={dept} className={`dept-item ${data.status.toLowerCase()}`}>
                              <span className="dept-name">{dept.replace('_', ' ')}</span>
                              <span className="dept-status">{data.status}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="action-section" style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <h3>Department Action</h3>

                    {/* Verification Checklist - Full Width */}
                    {currentUser?.role !== 'super_admin' && currentUser?.department &&
                      selectedProposal.departmentApprovals?.[currentUser.department]?.status === 'Pending' && (
                        <div className="checklist-section">
                          <h4>Verification Criteria</h4>
                          {(DEPARTMENT_CHECKLISTS[currentUser.department] || DEPARTMENT_CHECKLISTS['default']).map((item, idx) => (
                            <label key={idx} className="checkbox-item">
                              <input
                                type="checkbox"
                                checked={!!checkedCriteria[idx]}
                                onChange={(e) => setCheckedCriteria(prev => ({ ...prev, [idx]: e.target.checked }))}
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      )}

                    <div className="card-actions">
                      {currentUser?.role === 'super_admin' && (
                        <>
                          {(selectedProposal.status !== 'Approved' && selectedProposal.status !== 'Rejected') ? (
                            <div className="btn-group right-align">
                              {(() => {
                                // Verify all attached docs are viewed
                                const requiredDocs = ['ownershipProofUrl', 'buildingPlanUrl', 'idProofUrl', 'applicantPhotoUrl'];
                                const existingDocs = requiredDocs.filter(key => selectedProposal[key]);
                                const allDocsViewed = existingDocs.every(key => viewedDocs[key]);

                                return (
                                  <button
                                    className={`btn-action approve ${!allDocsViewed ? 'disabled' : ''}`}
                                    onClick={() => {
                                      if (!allDocsViewed) {
                                        alert("Please view all attached documents before approving.");
                                        return;
                                      }
                                      updateStatus(selectedProposal._id, 'Approved');
                                    }}
                                    disabled={!allDocsViewed}
                                    style={!allDocsViewed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                  >
                                    Final Approve
                                  </button>
                                );
                              })()}
                              <button className="btn-action reject" onClick={() => updateStatus(selectedProposal._id, 'Rejected')}>Final Reject</button>
                            </div>
                          ) : (
                            <div className="status-complete-msg">Action Completed ({selectedProposal.status})</div>
                          )}
                        </>
                      )}

                      {currentUser?.role !== 'super_admin' && currentUser?.department && (
                        <>
                          {selectedProposal.departmentApprovals?.[currentUser.department]?.status === 'Pending' ? (
                            <div className="btn-group right-align">
                              {(() => {
                                const checklist = DEPARTMENT_CHECKLISTS[currentUser.department] || DEPARTMENT_CHECKLISTS['default'];
                                const allChecked = checklist.every((_, i) => checkedCriteria[i]);

                                // Verify all attached docs are viewed
                                const requiredDocs = ['ownershipProofUrl', 'buildingPlanUrl', 'idProofUrl', 'applicantPhotoUrl'];
                                const existingDocs = requiredDocs.filter(key => selectedProposal[key]);
                                const allDocsViewed = existingDocs.every(key => viewedDocs[key]);

                                const canAccept = allChecked && allDocsViewed;

                                return (
                                  <button
                                    className={`btn-action approve ${!canAccept ? 'disabled' : ''}`}
                                    onClick={() => {
                                      if (!allChecked) {
                                        alert("Please verify all criteria before accepting.");
                                        return;
                                      }
                                      if (!allDocsViewed) {
                                        alert("Please view all attached documents before accepting.");
                                        return;
                                      }
                                      updateStatus(selectedProposal._id, 'Cleared', currentUser.department);
                                    }}
                                    disabled={!canAccept}
                                    style={!canAccept ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                  >
                                    Accept
                                  </button>
                                );
                              })()}
                              <button className="btn-action reject" onClick={() => {
                                const reason = prompt("Please provide a reason for rejection:");
                                if (!reason) return;
                                updateStatus(selectedProposal._id, 'Rejected', currentUser.department, reason);
                              }}>Reject</button>
                            </div>
                          ) : (
                            <div className="status-complete-msg">
                              Your Action: <strong>{selectedProposal.departmentApprovals?.[currentUser.department]?.status}</strong>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="split-right">
                  <h3>Model Risk Scoring</h3>
                  <div className="risk-placeholder glass-panel">
                    <div className="risk-icon">🤖</div>
                    <h4>AI Validation Module</h4>
                    <p>Automated geospatial risk assessment pending.</p>
                    <div className="risk-meter"><div className="meter-fill"></div></div>
                    <span className="risk-status">Processing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DOCUMENT VIEWER MODAL */}
      {viewDoc && (
        <div className="doc-viewer-modal">
          <button className="close-doc-btn" onClick={() => setViewDoc(null)}>✕ Close File</button>
          <div className="doc-viewer-content">
            {viewDoc.uri.toLowerCase().endsWith('.pdf') ? (
              <iframe src={viewDoc.uri} width="100%" height="100%" style={{ border: 'none' }}>
                <p>Your browser does not support PDFs. <a href={viewDoc.uri}>Download the PDF</a>.</p>
              </iframe>
            ) : (
              <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
                <img
                  src={viewDoc.uri}
                  alt="Document"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.2rem 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .header-left h1 { font-size: 1.6rem; color: #1a237e; margin: 0; }
        .user-badge { font-size: 0.85rem; color: #666; background: #f0f2f5; padding: 2px 8px; border-radius: 12px; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .search-box input, .filter-select select { padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #ddd; }
        .logout-btn { background: #ffebee; color: #c62828; border: 1px solid #ef5350; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; }

        /* LIST ITEM STYLES */
        .proposals-list { display: flex; flex-direction: column; gap: 0.8rem; }
        .proposal-item { transition: all 0.3s; overflow: hidden; border-left: 4px solid transparent; }
        .proposal-item:hover { border-left-color: #1a237e; }
        
        .item-header {
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            background: white;
            transition: background 0.2s;
        }
        .item-header:hover { background: #f8fbff; }
        .header-info { display: flex; align-items: center; gap: 1rem; }
        .case-id-label { font-size: 0.75rem; font-weight: 700; color: #999; letter-spacing: 1px; }
        .case-id-val { font-size: 1.1rem; font-weight: 600; color: #1a237e; }
        .header-date { font-weight: 500; color: #555; font-size: 0.9rem; }

        /* OVERLAY STYLES */
        .fullscreen-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(240, 242, 245, 0.98);
            z-index: 1000;
            overflow-y: auto;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .overlay-content {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .close-btn {
            position: absolute;
            top: 1.5rem;
            right: 2rem;
            padding: 0.5rem 1rem;
            background: #eee;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            color: #333;
        }
        .close-btn:hover { background: #ddd; }

        .overlay-header { margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .overlay-header h2 { font-size: 1.8rem; color: #1a237e; margin: 0; }

        /* SPLIT LAYOUT */
        .item-body-split {
            border-top: 1px solid #eee;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            padding: 2rem;
            background: #fbfbfb;
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .split-left { padding-right: 2rem; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; min-height: 60vh; }
        .split-right { padding-left: 2rem; }

        .split-left h3, .split-right h3 { font-size: 0.9rem; color: #444; margin-bottom: 1rem; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.5rem; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 0.7rem; color: #888; margin-bottom: 0.3rem; font-weight: 600; text-transform: uppercase; }
        .form-group input { 
            padding: 0.6rem; 
            border: 1px solid #e0e0e0; 
            border-radius: 6px; 
            color: #333; 
            background: #fff;
            font-weight: 500;
        }
        
        .doc-stack { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
        .view-btn.plain { 
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.8rem 1rem;
            background: white;
            border: 1px solid #eee;
            border-left: 3px solid #1a237e;
            border-radius: 6px;
            color: #333;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .view-btn.plain:hover { background: #f8fbff; transform: translateX(2px); border-color: #1a237e; }
        .view-btn.plain.viewed { border-left-color: #4CAF50; color: #388e3c; background: #f1f8e9; }
        .view-btn.plain.viewed:hover { background: #e8f5e9; }

        .dept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; margin-bottom: 1.5rem; }
        .dept-item { display: flex; flex-direction: column; padding: 0.5rem; border-radius: 4px; background: white; font-size: 0.8rem; border: 1px solid #eee; }
        .dept-item.pending { border-left: 3px solid #FF9800; }
        .dept-item.cleared { border-left: 3px solid #4CAF50; background: #f6fdf7; }
        .dept-item.objection { border-left: 3px solid #F44336; background: #fff5f5; }
        .dept-name { font-weight: 600; text-transform: capitalize; }
        .dept-status { color: #666; }

        .action-section { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .checklist-section {
            background: #fff8e1;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.2rem;
            border: 1px solid #ffe082;
        }
        .checklist-section h4 { 
            color: #f57f17; 
            margin-bottom: 0.8rem; 
            font-size: 0.8rem !important; 
            border-bottom: none !important;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            margin-bottom: 0.6rem;
            font-size: 0.85rem;
            color: #444;
            cursor: pointer;
            font-weight: 500;
        }
        .checkbox-item input { width: 16px; height: 16px; margin: 0; cursor: pointer; }
        .card-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
        .btn-group.right-align { display: flex; gap: 1rem; width: auto; }
        .btn-action { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; min-width: 100px; }
        .btn-action:hover { transform: translateY(-1px); }
        
        .approve { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
        .approve:hover { background: #c8e6c9; }
        .reject { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
        .reject:hover { background: #ffcdd2; }
        
        .status-complete-msg { text-align: center; color: #555; font-size: 0.9rem; font-style: italic; background: #f5f5f5; padding: 0.8rem; border-radius: 6px; width: 100%; }
        .remark-text { font-size: 0.85rem; color: #d32f2f; margin-top: 5px; display: block; font-style: italic; }
        
        .status-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-badge.approved { background: #e8f5e9; color: #2e7d32; }
        .status-badge.rejected { background: #ffebee; color: #c62828; }
        .status-badge.pending { background: #fff3e0; color: #ef6c00; }
        
        .risk-placeholder {
            text-align: center;
            padding: 3rem 1.5rem;
            border: 2px dashed #e0e0e0;
            border-radius: 12px;
            background: #fafafa;
        }
        .risk-icon { font-size: 3rem; margin-bottom: 1rem; }
        .risk-meter { height: 8px; background: #eee; border-radius: 4px; margin: 1.5rem 0; overflow: hidden; }
        .meter-fill { width: 60%; height: 100%; background: linear-gradient(90deg, #2196F3, #21CBF3); }
        .risk-status { font-size: 0.8rem; color: #888; letter-spacing: 1px; text-transform: uppercase; }
        
        .loading-text { text-align: center; color: #666; margin-top: 3rem; font-size: 1.1rem; }
        .empty-state { text-align: center; color: #888; margin-top: 3rem; font-style: italic; }
        
        /* DOC VIEWER STYLES */
        .doc-viewer-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          z-index: 2000;
          display: flex;
          flex-direction: column;
        }
        .close-doc-btn {
          align-self: flex-end;
          margin: 1rem;
          padding: 0.5rem 1rem;
          background: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          z-index: 2001;
        }
        .doc-viewer-content {
          flex: 1;
          margin: 0 2rem 2rem 2rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
