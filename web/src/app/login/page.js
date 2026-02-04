"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usernameStr = e.target.email.value;
    const passwordStr = e.target.password.value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameStr, password: passwordStr })
      });
      const data = await res.json();

      if (data.success) {
        // Save user session
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'user') {
          router.push('/proposal/step1');
        } else {
          router.push('/admin');
        }
      } else {
        alert("Login Failed: " + data.error);
      }
    } catch (err) {
      console.error("Login Error", err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card animate-fade-in">
        <div className="card-header">
          <h2>Welcome Back</h2>
          <p>Access your building proposals securely</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email / Username</label>
            <input
              type="text"
              id="email"
              placeholder="architect@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="card-footer">
          <p>Don't have a license?</p>
          <Link href="/register" className="register-link">Register as User/Engineer</Link>
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
          max-width: 400px;
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
          margin-top: 1rem;
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
      `}</style>
    </div>
  );
}
