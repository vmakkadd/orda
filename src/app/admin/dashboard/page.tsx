'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import { getOrders, updateOrderStatus } from '@/lib/services/orderService';

export default function DashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    document.title = 'ORDA - Admin Dashboard';

    void (async () => {
      try {
        const data = await getOrders();

        setOrders(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function updateStatus(id: number, status: string) {
    try {
      await updateOrderStatus(id, status);

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order)),
      );

      setSuccessMessage(`Order marked as ${status}`);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  }

  const totalOrders = orders.length;

  const newOrders = orders.filter((o) => o.status === 'New').length;

  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;

  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="page">
      {successMessage && <div className="toast">✓ {successMessage}</div>}

      <h1 className="top-head">Orders</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <span>{totalOrders}</span>
        </div>

        <div className="stat-card">
          <h3>New</h3>
          <span>{newOrders}</span>
        </div>

        <div className="stat-card">
          <h3>Preparing</h3>
          <span>{preparingOrders}</span>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <span>{completedOrders}</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.order_number}</td>

                    <td>{order.customer_name}</td>

                    <td>${order.total}</td>

                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>

                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="view-btn"
                        style={{
                          background: '#c8813a',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '8px 18px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontFamily: 'Arial, sans-serif',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #faf7f2;
          font-family: 'Georgia', 'Times New Roman', serif;
          padding: 32px;
        }

        .top-head {
          font-size: 30px;
          margin-left: 20px;
          margin-bottom: 30px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }

        .stat-card h3 {
          margin: 0;
          color: #9e836b;
          font-size: 15px;
          font-weight: 500;
        }

        .stat-card span {
          display: block;
          margin-top: 12px;
          font-size: 40px;
          font-weight: 700;
          color: #2c1a0e;
        }

        .table-container {
          overflow-x: auto;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .table-wrap {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          min-width: 900px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #2c1a0e;
        }

        th {
          color: white;
          text-align: left;
          padding: 18px;
          font-size: 15px;
        }

        td {
          padding: 18px;
          border-bottom: 1px solid #f0ebe4;
          color: #2c1a0e;
        }

        .status-select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          min-width: 140px;
        }

        .loading {
          padding: 20px;
        }

        @media (max-width: 768px) {
          .page {
            padding: 16px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .header-actions {
            width: 100%;
          }

          .site-btn,
          .logout-btn {
            flex: 1;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card span {
            font-size: 28px;
          }
        }

        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #2e7d32;
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.25s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-12px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
