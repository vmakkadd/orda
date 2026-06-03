'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { loginAdmin, getCurrentSession } from '@/lib/services/adminService';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login - ORDA';

    async function checkSession() {
      const {
        data: { session },
      } = await getCurrentSession();

      if (session) {
        router.push('/admin/dashboard');
      }
    }

    checkSession();
  }, [router]);

  async function handleLogin() {
    try {
      setLoading(true);
      setError('');

      await loginAdmin(email, password);

      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <Link href="/" className="brand-link">
          <div className="brand">
            <span className="brand-icon">☕</span>
            <div className="brand-wrap">
              <h1 className="brand-name">ORDA</h1>
              <p className="brand-sub">Order with ease</p>
            </div>
          </div>
        </Link>

        <h2>Admin Login</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #faf7f2;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 8px 30px rgba(44, 26, 14, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin-bottom: 15px;
        }
        .brand-icon {
          font-size: 28px;
        }
        .brand-name {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #2c1a0e;
          margin: 0;
          line-height: 1;
        }
        .brand-sub {
          font-size: 10px;
          color: #8a6f55;
          margin: 0;
          letter-spacing: 0.08em;
          font-family: 'Arial', sans-serif;
          text-transform: uppercase;
        }

        h2 {
          text-align: center;
          color: #2c1a0e;
          margin-bottom: 24px;
          font-family: Georgia, serif;
        }

        input {
          width: 100%;
          height: 52px;
          border: 1px solid #e8ddd1;
          border-radius: 12px;
          padding: 0 16px;
          margin-bottom: 14px;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #c8813a;
        }

        button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
          background: #2c1a0e;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #4a2e18;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error {
          background: #fff1f1;
          color: #d32f2f;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
