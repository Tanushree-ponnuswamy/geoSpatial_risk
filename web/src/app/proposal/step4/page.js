"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../../components/StepIndicator';
import dynamic from 'next/dynamic';

// Dynamically import MapPicker to disable SSR for Leaflet
const MapPicker = dynamic(() => import('../../../components/MapPicker'), {
    ssr: false,
    loading: () => <div className="map-loading">Loading Map...</div>
});

export default function Step4() {
    const router = useRouter();
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('proposalDraft');
        if (saved) {
            const parsed = JSON.parse(saved);

            // If lat/long are missing, provide defaults or simulate fetch based on text
            if (!parsed.latitude) {
                // Simple mock coordinate assignment based on town for demo purposes
                if (parsed.town?.includes('Ooty')) { parsed.latitude = "11.4102"; parsed.longitude = "76.6950"; }
                else if (parsed.town?.includes('Coonoor')) { parsed.latitude = "11.3530"; parsed.longitude = "76.7959"; }
                else { parsed.latitude = "11.4000"; parsed.longitude = "76.7000"; }
            }
            setDraft(parsed);
        } else {
            router.push('/proposal/step1');
        }
    }, [router]);

    const handleLocationSelect = (coords) => {
        const updated = { ...draft, latitude: coords.lat, longitude: coords.lng };
        setDraft(updated);
        // Update local storage so it persists if they navigate back/forward
        localStorage.setItem('proposalDraft', JSON.stringify(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION: Ensure files were "uploaded" in Step 3
        if (!draft?.filesUploaded) {
            alert("⚠️ Missing Documents!\nPlease go back to Step 3 and upload the required proof documents.");
            return;
        }

        setLoading(true);

        // Get current user for attribution
        const userJSON = localStorage.getItem('currentUser');
        const user = userJSON ? JSON.parse(userJSON) : null;

        const payload = {
            ...draft,
            submittedBy: user ? user.username : 'Guest User'
        };

        try {
            const res = await fetch('/api/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                // Clear draft only on success
                localStorage.removeItem('proposalDraft');
                router.push('/proposal/step5');
            } else {
                alert("Submission Failed: " + data.error);
                setLoading(false);
            }
        } catch (err) {
            alert("An error occurred during submission.");
            console.error(err);
            setLoading(false);
        }
    };

    if (!draft) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="form-page">
            <div className="form-container glass-card">

                <StepIndicator currentStep={4} />

                <div className="form-header">
                    <h1>Location Verification</h1>
                    <p>Confirm the plot location and coordinates before submitting.</p>
                </div>

                <div className="map-section glass-panel">
                    <div className="map-wrapper">
                        <MapPicker
                            initialLat={draft.latitude}
                            initialLng={draft.longitude}
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>
                </div>

                <div className="coordinates-card">
                    <div className="coord-item">
                        <span className="coord-icon">📍</span>
                        <div className="coord-info">
                            <label>Latitude</label>
                            <input
                                type="text"
                                value={draft.latitude || ''}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="coord-divider"></div>
                    <div className="coord-item">
                        <span className="coord-icon">📍</span>
                        <div className="coord-info">
                            <label>Longitude</label>
                            <input
                                type="text"
                                value={draft.longitude || ''}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => router.push('/proposal/step3')}
                        >
                            ← Back
                        </button>
                        <button type="submit" className="btn btn-primary btn-xl" disabled={loading}>
                            {loading ? 'Submitting...' : 'Confirm & Submit Proposal'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .form-page {
          padding: 3rem 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .form-container {
          padding: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .form-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .form-header h1 {
            color: var(--primary-dark);
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .map-section {
            background: white;
            padding: 10px;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .map-wrapper {
            height: 500px;
            border-radius: 12px;
            overflow: hidden;
            background: #f0f0f0;
            position: relative;
            z-index: 1; 
        }

        .map-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #888;
            font-size: 1.1rem;
        }

        .coordinates-card {
            display: flex;
            align-items: center;
            background: #F8F9FA;
            border: 1px solid #E9ECEF;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .coord-item {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 1rem;
        }

        .coord-icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            opacity: 0.7;
        }

        .coord-info {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .coord-info label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
            margin-bottom: 0.25rem;
            font-weight: 600;
        }

        .coord-info input {
            background: transparent;
            border: none;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 700;
            color: #343a40;
            width: 100%;
            outline: none;
        }

        .coord-divider {
            width: 1px;
            height: 40px;
            background: #DEE2E6;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }

        .btn-xl {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        
        .btn-secondary {
            color: #6c757d;
            background: transparent;
            border: 1px solid transparent;
        }

        .btn-secondary:hover {
            color: #495057;
            background: #f8f9fa;
            border-color: #dee2e6;
        }
      `}</style>
        </div>
    );
}
