import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ValidationActions from './actions';

// Force dynamic to ensure we see latest status
export const dynamic = 'force-dynamic';

async function getProposal(id) {
    const dataPath = path.join(process.cwd(), '../data/proposals.json');
    try {
        const fileContent = await fs.readFile(dataPath, 'utf8');
        const data = JSON.parse(fileContent);
        return data.find(p => p.id === id);
    } catch (error) {
        return null;
    }
}

// 🧠 SIMULATED GIS & AI ENGINE
// In a real app, this would be a Python Microservice call.
function runSystemIntelligence(proposal) {
    // 1. Simulate GIS Geofencing
    const isInsideForest = Math.random() < 0.1; // 10% chance
    const slope = Math.floor(Math.random() * 35); // 0 to 35 degrees
    const soilType = ["Stable Rock", "Loose Soil", "Clay", "Marshy"][Math.floor(Math.random() * 4)];
    const distanceToStream = Math.floor(Math.random() * 100); // meters

    // 2. Simulate ML Risk Scoring (Deterministic Logic from RISK_MODEL.md)
    let riskScore = 0;

    // Slope Factor (Max 40)
    if (slope > 30) riskScore += 40;
    else if (slope > 20) riskScore += 25;
    else if (slope > 10) riskScore += 10;

    // Soil Factor (Max 25)
    if (soilType === "Loose Soil") riskScore += 20;
    if (soilType === "Clay") riskScore += 15;

    // Water Factor (Max 20)
    if (distanceToStream < 15) riskScore += 20;
    else if (distanceToStream < 30) riskScore += 10;

    // 3. Generate Reason
    const aiReasoning = `Based on GIS analysis, the land has a ${slope}° slope with ${soilType}. It is ${distanceToStream}m from the nearest water body.${isInsideForest ? ' CRITICAL: Inside Forest Boundary.' : ''}`;

    return {
        gis: { isInsideForest, slope, soilType, distanceToStream },
        risk: {
            score: isInsideForest ? 100 : riskScore, // Auto-100 if Forest
            category: isInsideForest || riskScore > 75 ? 'Very High' : riskScore > 40 ? 'Medium' : 'Low',
            reason: aiReasoning
        }
    };
}

export default async function ProposalReview({ params }) {
    const proposal = await getProposal(params.id);

    if (!proposal) {
        notFound();
    }

    // Run the "AI" analysis on load
    const analysis = runSystemIntelligence(proposal);

    return (
        <div className="main-container">
            <div className="header-actions" style={{ marginBottom: '2rem' }}>
                <a href="/" className="back-link">&larr; Back to Dashboard</a>
                <h1>Reviewing: {proposal.id}</h1>
            </div>

            <div className="review-grid">
                {/* LEFT COLUMN: USER SUBMISSION */}
                <div className="card">
                    <h2>👤 User Submission</h2>
                    <div className="data-row">
                        <label>Village</label>
                        <div className="value">{proposal.village}</div>
                    </div>
                    <div className="data-row">
                        <label>Survey No</label>
                        <div className="value">{proposal.surveyNo}</div>
                    </div>
                    <div className="data-row">
                        <label>Intended Use</label>
                        <div className="value">{proposal.type}</div>
                    </div>
                    <div className="data-row">
                        <label>Requested Floors</label>
                        <div className="value">{proposal.floors}</div>
                    </div>

                    <div className="doc-preview">
                        <p>📄 Building_Plan.pdf (Preview unavailable)</p>
                    </div>
                </div>

                {/* RIGHT COLUMN: SYSTEM INTELLIGENCE */}
                <div className="card system-card">
                    <h2>🤖 System Intelligence (GIS + ML)</h2>

                    <div className="stat-grid">
                        <div className={`stat-box ${analysis.risk.category === 'Very High' ? 'danger' : ''}`}>
                            <span className="label">Risk Score</span>
                            <span className="big-val">{analysis.risk.score}/100</span>
                        </div>
                        <div className="stat-box">
                            <span className="label">Slope</span>
                            <span className="big-val">{analysis.gis.slope}°</span>
                        </div>
                    </div>

                    <div className="gis-checklist">
                        <div className={`check-item ${analysis.gis.isInsideForest ? 'fail' : 'pass'}`}>
                            {analysis.gis.isInsideForest ? '❌' : '✅'} Inside Forest Boundary
                        </div>
                        <div className={`check-item ${analysis.gis.distanceToStream < 15 ? 'warn' : 'pass'}`}>
                            {analysis.gis.distanceToStream < 15 ? '⚠️' : '✅'} Safe Distance from Stream ({analysis.gis.distanceToStream}m)
                        </div>
                        <div className={`check-item ${analysis.gis.soilType === 'Loose Soil' ? 'warn' : 'pass'}`}>
                            Soil Stability: <b>{analysis.gis.soilType}</b>
                        </div>
                    </div>

                    <div className="ai-summary">
                        <strong>AI Reasoning:</strong>
                        <p>{analysis.risk.reason}</p>
                    </div>

                </div>
            </div>

            {/* ACTION BAR */}
            <ValidationActions
                id={proposal.id}
                currentStatus={proposal.status}
                suggestedRisk={analysis.risk.score}
            />

            <style>{`
        .review-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .back-link {
          text-decoration: none;
          color: var(--secondary-color);
          font-weight: 500;
          display: block;
          margin-bottom: 1rem;
        }

        .data-row {
          margin-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }
        
        .data-row label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          text-transform: uppercase;
        }
        
        .value {
          font-size: 1.1rem;
          font-weight: 500;
        }

        .system-card {
           background: #e3f2fd;
           border-color: #bbdefb;
        }

        .stat-grid {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-box {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          flex: 1;
          text-align: center;
        }
        
        .stat-box.danger { border: 2px solid var(--risk-high); color: var(--risk-high); }

        .label { display: block; font-size: 0.8rem; color: #666; }
        .big-val { font-size: 1.8rem; font-weight: 800; }

        .check-item {
          padding: 0.8rem;
          background: rgba(255,255,255,0.6);
          margin-bottom: 0.5rem;
          border-radius: 4px;
        }
        .check-item.fail { color: var(--risk-high); font-weight: bold; background: #ffebee; }
        .check-item.warn { color: var(--risk-med); background: #fff3e0; }
        .check-item.pass { color: var(--risk-low); }

        .ai-summary {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
          border-left: 4px solid var(--primary-light);
        }
      `}</style>
        </div>
    );
}
