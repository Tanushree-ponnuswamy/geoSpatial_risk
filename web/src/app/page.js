"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="badge">🌱 Eco-Sensitive Zone Protection</div>
        <h1 className="hero-title">
          Build Responsibly in the <br />
          <span className="highlight">Nilgiris Biosphere</span>
        </h1>
        <p className="hero-subtitle">
          An AI-powered Geo-Spatial approval system that checks slope stability,
          soil risks, and forest boundaries in real-time. Safety first, always.
        </p>

        <div className="cta-group">
          <Link href="/login" className="btn btn-primary btn-lg">
            Start New Proposal
          </Link>
          <Link href="/admin" className="btn btn-secondary btn-lg">
            Admin Panel
          </Link>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">GIS Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Paperwork</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24x7</span>
            <span className="stat-label">Risk Analysis</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 1.5rem;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .hero-content {
          max-width: 800px;
          animation: fadeIn 0.8s ease-out;
        }
        
        .badge {
          display: inline-block;
          background: rgba(46, 125, 50, 0.1);
          color: var(--primary-dark);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(46, 125, 50, 0.2);
        }

        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .highlight {
          background: linear-gradient(120deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0) 100%);
          color: var(--primary-dark);
          padding-left: 0.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 4rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 2rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
