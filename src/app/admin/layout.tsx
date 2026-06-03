'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      // Allow login page without auth
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      setLoading(false);
    }

    checkAdmin();
  }, [pathname, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#faf7f2',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #e8e0d4',
            borderTopColor: '#2c1a0e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {pathname !== '/admin/login' && (
        <AdminHeader title="ORDA Admin" subtitle="Order Management" />
      )}

      {children}
    </div>
  );
}
