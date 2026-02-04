"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidationActions({ id, currentStatus, suggestedRisk }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDecision = async (decision) => {
        if (!confirm(`Are you sure you want to ${decision} this proposal?`)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/proposal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status: decision === 'APPROVE' ? 'Approved' : 'Rejected',
                    riskScore: suggestedRisk
                })
            });

            if (res.ok) {
                alert("Decision Recorded Successfully");
                router.push('/');
                router.refresh();
            } else {
                alert("Error updating status");
            }
        } catch (e) {
            alert("Network error");
        }
        setLoading(false);
    };

    if (currentStatus === 'Approved' || currentStatus === 'Rejected') {
        return (
            <div className="card" style={{ textAlign: 'center', background: '#f5f5f5' }}>
                <h3>🔒 This proposal is closed.</h3>
                <p>Final Status: <strong>{currentStatus}</strong></p>
            </div>
        );
    }

    return (
        <div className="card action-bar">
            <div className="action-text">
                <h3>Officer Decision</h3>
                <p>You are the accountable authority.</p>
            </div>
            <div className="btn-group">
                <button
                    className="btn btn-reject"
                    onClick={() => handleDecision('REJECT')}
                    disabled={loading}
                >
                    ❌ Reject
                </button>
                <button
                    className="btn btn-approve"
                    onClick={() => handleDecision('APPROVE')}
                    disabled={loading}
                >
                    ✅ Approve & Grant Permit
                </button>
            </div>

            <style jsx>{`
        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border-top: 4px solid var(--primary-light);
        }
        .btn-group {
          display: flex;
          gap: 1rem;
        }
        .btn-reject {
          background: white;
          border: 2px solid var(--risk-high);
          color: var(--risk-high);
        }
        .btn-reject:hover {
          background: var(--risk-high);
          color: white;
        }
        .btn-approve {
          background: var(--primary-color);
          color: white;
          padding: 0.8rem 1.5rem;
          font-size: 1.1rem;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
