"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        // Map API data to UI structure
        const formatted = data.map(p => ({
          id: p.id,
          location: p.village || 'Unknown Location', // Map village to location
          status: p.status || 'Pending',
          date: p.submittedAt || 'N/A'
        }));
        setProposals(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch proposals", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <div className="header-row">
        <div>
          <h1>All Proposals</h1>
          <p className="subtitle">Track status and view risk reports for all submissions.</p>
        </div>
        <Link href="/proposal/step1" className="btn btn-primary">
          + New Proposal
        </Link>
      </div>

      <div className="filters">
        <button className="filter-chip active">All</button>
        <button className="filter-chip">Approved</button>
        <button className="filter-chip">Pending</button>
      </div>

      {loading ? (
        <div className="loading-state">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="empty-state">No proposals found in the system.</div>
      ) : (
        <div className="proposals-grid">
          {proposals.map((prop) => (
            <div key={prop.id} className="proposal-card glass-card">
              <div className="card-top">
                <span className="prop-id">{prop.id}</span>
                <span className={`status-badge status-${prop.status.toLowerCase().includes('approved') ? 'approved' : prop.status.toLowerCase().includes('rejected') ? 'rejected' : 'pending'}`}>
                  {prop.status}
                </span>
              </div>

              <h3>{prop.location}</h3>
              <p className="prop-date">Submitted: {prop.date}</p>

              <div className="card-actions">
                <button className="btn btn-secondary btn-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .subtitle {
          color: var(--text-secondary);
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-chip {
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          border: 1px solid #E0E0E0;
          background: white;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .filter-chip.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .proposals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .proposal-card {
           transition: transform 0.2s;
        }
        
        .proposal-card:hover {
          transform: translateY(-4px);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .prop-id {
          font-family: monospace;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .prop-date {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .btn-sm {
          width: 100%;
          padding: 0.6rem;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
