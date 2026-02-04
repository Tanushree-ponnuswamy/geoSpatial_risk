"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../../components/StepIndicator';

export default function Step2() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState({});
    const [ownerData, setOwnerData] = useState({
        ownerName: '',
        ownerContact: '',
        ownerAddress: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('proposalDraft');
        if (saved) {
            setDraft(JSON.parse(saved));
            const existingOwnerData = JSON.parse(saved);
            // If owner details already exist in merged draft, prefill them
            if (existingOwnerData.ownerName) {
                setOwnerData({
                    ownerName: existingOwnerData.ownerName || '',
                    ownerContact: existingOwnerData.ownerContact || '',
                    ownerAddress: existingOwnerData.ownerAddress || ''
                });
            }
        }
    }, [router]);

    const handleNext = (e) => {
        e.preventDefault();

        // Merge owner details into draft and save
        const updatedDraft = { ...draft, ...ownerData };
        localStorage.setItem('proposalDraft', JSON.stringify(updatedDraft));

        router.push('/proposal/step3');
    };

    return (
        <div className="form-page">
            <div className="form-container glass-card">

                <StepIndicator currentStep={2} />

                <div className="form-header">
                    <h1>Owner Personal Details</h1>
                    <p>Provide contact information for the land owner.</p>
                </div>

                <form onSubmit={handleNext}>

                    {/* SECTION 1: OWNER DETAILS */}
                    <div className="form-section">
                        <h3>👤 Land Owner Details</h3>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Owner Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={ownerData.ownerName}
                                    onChange={(e) => setOwnerData({ ...ownerData, ownerName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={ownerData.ownerContact}
                                    onChange={(e) => setOwnerData({ ...ownerData, ownerContact: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Current Address</label>
                            <textarea
                                rows="2"
                                placeholder="Residential Address"
                                value={ownerData.ownerAddress}
                                onChange={(e) => setOwnerData({ ...ownerData, ownerAddress: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => router.push('/proposal/step1')}
                        >
                            ← Back
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg">
                            Next Step →
                        </button>
                    </div>

                </form>
            </div>

            <style jsx>{`
        .form-page {
          padding: 3rem 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .form-container {
          padding: 3rem;
        }

        .form-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          margin-bottom: 1.5rem;
          color: var(--primary-dark);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }
      `}</style>
        </div>
    );
}
