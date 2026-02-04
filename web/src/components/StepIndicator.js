"use client";

import { useRouter } from 'next/navigation';

export default function StepIndicator({ currentStep }) {
  const router = useRouter();

  const steps = [
    { id: 1, label: "Land Details" },
    { id: 2, label: "Personal" },
    { id: 3, label: "Documents" },
    { id: 4, label: "Map View" },
    { id: 5, label: "Success" }
  ];

  return (
    <div className="steps-wrapper">
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step-block">
            {/* Connection Line (except for last item) */}
            {index < steps.length - 1 && (
              <div
                className={`step-line ${currentStep > step.id ? 'completed' : ''}`}
              ></div>
            )}

            <div
              className={`step-item ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''} ${step.id === 5 && currentStep !== 5 ? 'disabled' : ''}`}
              onClick={() => {
                if (step.id === 5 && currentStep < 5) return;
                router.push(step.id === 5 ? '/proposal/step5' : `/proposal/step${step.id}`);
              }}
              style={{ cursor: step.id === 5 && currentStep !== 5 ? 'not-allowed' : 'pointer' }}
            >
              <div className="step-circle">
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .steps-wrapper {
          margin-bottom: 3rem;
          width: 100%;
          overflow-x: auto;
        }

        .steps-container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          min-width: 600px; /* Ensure generic width for lines */
          padding: 0 1rem;
        }

        .step-block {
          position: relative;
          display: flex;
          align-items: center;
        }

        .step-block:last-child {
          flex: 0 0 auto;
        }
        
        /* The line is absolute to span between circles */
        .step-block:not(:last-child) {
          flex: 1;
        }

        .step-line {
          position: absolute;
          top: 20px;
          left: 50%; /* Start from center of current circle */
          width: 100%; /* Span to next container */
          height: 3px;
          background: #E0E0E0;
          z-index: 0;
        }

        .step-line.completed {
          background: #4CAF50;
        }

        .step-item {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%; /* Center in the flex block */
          min-width: 100px;
        }
        
        .step-item.disabled {
            opacity: 0.6;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #E0E0E0;
          background: white;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s;
        }

        /* Active State */
        .step-item.active .step-circle {
          background: #4CAF50;
          border-color: #4CAF50;
          color: white;
          box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
        }
        
        .step-item.active .step-label {
          color: #4CAF50;
          font-weight: 700;
        }

        /* Completed State */
        .step-item.completed .step-circle {
          background: #4CAF50;
          border-color: #4CAF50;
          color: white;
        }
        
        .step-item.completed .step-label {
          color: #4CAF50;
          font-weight: 500;
        }

        .step-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
