'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/lib/services/adminService';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function AdminHeader({
  title,
  subtitle,
  showBack = false,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace('/admin/login');
  };

  return (
    <header className="header">
      <Link href="/" className="brand-link">
        <div className="brand">
          <span className="brand-icon">☕</span>
          <div className="brand-wrap">
            <h1 className="brand-name">ORDA</h1>
            <p className="brand-sub">Order with ease</p>
          </div>
        </div>
      </Link>

      <div className="header-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 32px 18px;
          background: #faf7f2;
          position: sticky;
          border-bottom: 1px solid #e8e0d4;
          top: 0;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
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

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .site-btn,
        .logout-btn {
          background: #2c1a0e;
          color: white;
          border: none;
          text-decoration: none;
          border-radius: 10px;
          padding: 10px 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </header>
  );
}
