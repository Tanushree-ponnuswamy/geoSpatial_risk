"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            // Call the central Auth API on port 3000
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (data.success) {
                // Enforce Admin Role
                if (data.user.role === 'user') {
                    setError("Access Restricted: Authorized Personnel Only");
                    setLoading(false);
                    return;
                }

                // Save session
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                router.push('/');
            } else {
                setError(data.error || "Login Failed");
            }
        } catch (err) {
            console.error("Login connection error:", err);
            setError("Could not connect to authentication server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <div className="card-header">
                    <h1>Admin Portal</h1>
                    <p>Government of Tamil Nadu - GeoSpacial Risk Assessment</p>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Department / Admin ID</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="e.g. officer@revenue.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>

            <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          padding: 1rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .card-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .card-header h1 {
            color: #1a237e;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }

        .card-header p {
            color: #666;
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            font-weight: 600;
            color: #333;
        }

        .form-group input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: border 0.2s;
        }

        .form-group input:focus {
            border-color: #1a237e;
            outline: none;
        }

        .submit-btn {
            width: 100%;
            padding: 0.8rem;
            background: #1a237e;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .submit-btn:hover {
            background: #0d1b60;
        }

        .submit-btn:disabled {
            background: #9fa8da;
            cursor: not-allowed;
        }

        .error-banner {
            background: #ffebee;
            color: #c62828;
            padding: 0.8rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            text-align: center;
        }
      `}</style>
        </div>
    );
}
