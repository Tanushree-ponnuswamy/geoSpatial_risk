"use client";

import { useRouter } from 'next/navigation';
import StepIndicator from '../../../components/StepIndicator';

export default function Step5() {
    const router = useRouter();

    return (
        <div className="form-page">
            <div className="form-container glass-card">

                <StepIndicator currentStep={5} />

                <div className="success-content animate-fade-in">
                    <div className="success-icon">🎉</div>
                    <h1>Proposal Submitted!</h1>
                    <p className="subtitle">Your building proposal has been successfully registered.</p>

                    <div className="status-card">
                        <p>Status: <span className="status-badge">Assessment Pending</span></p>
                        <p className="info-text">Our automated risk assessment engine is processing your data.</p>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => router.push('/')}
                            className="btn btn-primary btn-lg"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .form-page {
          padding: 3rem 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .form-container {
          padding: 3rem;
          text-align: center;
        }

        .success-content {
            padding: 2rem 0;
        }

        .success-icon {
            font-size: 5rem;
            margin-bottom: 1rem;
            animation: bounce 1s infinite alternate;
        }

        .subtitle {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .status-card {
            background: #FFF3E0;
            border: 1px solid #FFE0B2;
            padding: 1.5rem;
            border-radius: 8px;
            max-width: 400px;
            margin: 0 auto 2rem;
        }

        .status-badge {
            background: #FF9800;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-left: 0.5rem;
        }

        .info-text {
            font-size: 0.9rem;
            color: #E65100;
            margin-top: 0.5rem;
            opacity: 0.9;
        }

        @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
