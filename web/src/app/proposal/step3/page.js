"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../../components/StepIndicator';

export default function Step3() {
  const router = useRouter();
  const [draft, setDraft] = useState({});
  const [uploading, setUploading] = useState({}); // Track uploading state per field

  useEffect(() => {
    const saved = localStorage.getItem('proposalDraft');
    if (saved) {
      setDraft(JSON.parse(saved));
    }
  }, [router]);

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        const updatedDraft = { ...draft, [fieldName]: data.url };
        setDraft(updatedDraft);
        localStorage.setItem('proposalDraft', JSON.stringify(updatedDraft));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploaded file');
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Check if all required files are uploaded
    const requiredFields = ['ownershipProofUrl', 'buildingPlanUrl', 'idProofUrl', 'applicantPhotoUrl'];
    const missing = requiredFields.filter(field => !draft[field]);

    if (missing.length > 0) {
      alert(`Please upload all required documents.`);
      return;
    }

    // Set flag for Step 4 check (legacy check, but URL presence is better)
    const updatedDraft = { ...draft, filesUploaded: true };
    localStorage.setItem('proposalDraft', JSON.stringify(updatedDraft));

    router.push('/proposal/step4');
  };

  return (
    <div className="form-page">
      <div className="form-container glass-card">

        <StepIndicator currentStep={3} />

        <div className="form-header">
          <h1>Document Upload</h1>
          <p>Upload required land and personal identification documents.</p>
        </div>

        <form onSubmit={handleNext}>

          {/* SECTION 1: LAND DOCUMENTS */}
          <div className="form-section">
            <h3>📄 Land Documents</h3>
            <div className="form-group">
              <label>Proof of Ownership (Patta / Sale Deed)</label>
              <input
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'ownershipProofUrl')}
                required={!draft.ownershipProofUrl}
              />
              {uploading['ownershipProofUrl'] && <span className="upload-status">Uploading...</span>}
              {draft.ownershipProofUrl && <span className="upload-success">✅ Uploaded</span>}
            </div>

            <div className="form-group">
              <label>Building Plan (PDF / CAD)</label>
              <input
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'buildingPlanUrl')}
                required={!draft.buildingPlanUrl}
              />
              {uploading['buildingPlanUrl'] && <span className="upload-status">Uploading...</span>}
              {draft.buildingPlanUrl && <span className="upload-success">✅ Uploaded</span>}
            </div>
          </div>

          <hr className="divider" />

          {/* SECTION 2: PERSONAL DOCUMENTS */}
          <div className="form-section">
            <h3>🆔 Personal Documents</h3>
            <div className="form-group">
              <label>Proposer ID Proof (Aadhar / PAN / Voter ID)</label>
              <input
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'idProofUrl')}
                required={!draft.idProofUrl}
              />
              {uploading['idProofUrl'] && <span className="upload-status">Uploading...</span>}
              {draft.idProofUrl && <span className="upload-success">✅ Uploaded</span>}
            </div>
            <div className="form-group">
              <label>Photo of Applicant</label>
              <input
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'applicantPhotoUrl')}
                required={!draft.applicantPhotoUrl}
              />
              {uploading['applicantPhotoUrl'] && <span className="upload-status">Uploading...</span>}
              {draft.applicantPhotoUrl && <span className="upload-success">✅ Uploaded</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/proposal/step2')}
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

        .file-input {
          display: block;
          width: 100%;
          padding: 1rem;
          border: 2px dashed #ccc;
          border-radius: 8px;
          background: #fafafa;
          cursor: pointer;
          transition: border-color 0.3s;
        }
        
        .file-input:hover {
          border-color: var(--primary-color);
          background: #f0fdf4;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }

        .upload-status {
            color: #f57c00;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: block;
        }

        .upload-success {
            color: #2e7d32;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: block;
            font-weight: 500;
        }

        .divider {
          border: 0;
          height: 1px;
          background: rgba(0,0,0,0.1);
          margin: 2rem 0;
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
