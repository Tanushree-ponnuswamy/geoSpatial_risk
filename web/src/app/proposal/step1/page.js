"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../../components/StepIndicator';

export default function Step1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taluk: '',
    town: '',
    village: '',
    surveyNo: '',
    latitude: '',
    longitude: '',
    type: 'Residential',
    floors: '2',
    area: ''
  });



  useEffect(() => {
    // Load saved draft if available
    const saved = localStorage.getItem('proposalDraft');
    if (saved) {
      setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    // Save to local storage for Step 2
    localStorage.setItem('proposalDraft', JSON.stringify(formData));
    router.push('/proposal/step2');
  };

  return (
    <div className="form-page">
      <div className="form-container glass-card">

        <StepIndicator currentStep={1} />

        <div className="form-header">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('proposalDraft');
              router.push('/');
            }}
          >
            Logout
          </button>
          <h1>New Building Proposal</h1>
          <p>Provide location and building specifications.</p>
        </div>

        <form onSubmit={handleNext}>
          {/* SECTION 1: LAND ID */}
          <div className="form-section">
            <h3>📍 Land Identification</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Taluk</label>
                <select
                  value={formData.taluk}
                  onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                  required
                >
                  <option value="">Select Taluk...</option>
                  <option value="Udhagamandalam">Udhagamandalam</option>
                  <option value="Coonoor">Coonoor</option>
                  <option value="Kotagiri">Kotagiri</option>
                  <option value="Gudalur">Gudalur</option>
                  <option value="Kundah">Kundah</option>
                  <option value="Pandalur">Pandalur</option>
                </select>
              </div>

              <div className="form-group">
                <label>Town / Pivot</label>
                <select
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  required
                >
                  <option value="">Select Town...</option>
                  <option value="Ooty">Ooty Town</option>
                  <option value="Coonoor">Coonoor Town</option>
                  <option value="Kotagiri">Kotagiri Town</option>
                  <option value="Gudalur">Gudalur Town</option>
                </select>
              </div>

              <div className="form-group">
                <label>Revenue Village</label>
                <input
                  type="text"
                  placeholder="Village Name"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Survey / RS Number</label>
                <input
                  type="text"
                  placeholder="e.g. 124/2B"
                  value={formData.surveyNo}
                  onChange={(e) => setFormData({ ...formData, surveyNo: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>


          {/* SECTION 2: BUILDING DETAILS */}
          <div className="form-section">
            <h3>🏠 Building Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Intended Use</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial (Requires extra clearance)</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Floors</label>
                <select
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                >
                  <option value="1">Ground Floor Only</option>
                  <option value="2">G + 1 (Max for certain zones)</option>
                  <option value="3">G + 2</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Total Built-up Area (Sq. ft)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg">Next Step →</button>
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
          position: relative;
        }
        
        .logout-btn {
            position: absolute;
            top: -2rem;
            right: 0;
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

        .map-placeholder {
          background: #E8F5E9;
          border: 1px solid #C8E6C9;
          border-radius: var(--radius-md);
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-dark);
          margin-top: 1rem;
        }

        .divider {
          border: 0;
          height: 1px;
          background: rgba(0,0,0,0.1);
          margin: 2rem 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: #E0E0E0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0 1rem;
        }

        .readonly-input {
          background: #f5f5f5;
          color: #666;
          cursor: not-allowed;
        }

        .helper-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          display: block;
        }

        .map-placeholder.active {
          background: #E8F5E9;
          border-color: var(--primary-color);
        }

        .xs-text {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }
      `}</style>
    </div >
  );
}
