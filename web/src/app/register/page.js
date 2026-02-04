"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('User');

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate generic registration logic
    setTimeout(() => {
      setLoading(false);
      alert('Registration Successful! Please sign in.');
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card animate-fade-in">
        <div className="card-header">
          <h2>User Registration</h2>
          <p>Create an account to submit proposals.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="John Doe" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="user@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="userType">Account Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="select-input"
            >
              <option value="User">General User / Land Owner</option>
              <option value="Engineer">Civil Engineer / Architect</option>
            </select>
          </div>

          {userType === 'Engineer' && (
            <div className="form-group animate-slide-down">
              <label htmlFor="coa">Engineer Registration Number</label>
              <input type="text" id="coa" placeholder="ER/2026/12345" required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a secure password" required />
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="card-footer">
          <p>Already have an account?</p>
          <Link href="/login" className="register-link">Sign In</Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: calc(100vh - 100px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 2.5rem;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-header p {
          color: var(--text-secondary);
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .card-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 1rem;
        }

        .register-link {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
          margin-left: 0.5rem;
        }
        
        .register-link:hover {
          text-decoration: underline;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-group input {
          width: auto;
          margin-right: 0.5rem;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .select-input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
          font-size: 1rem;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
