'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getOrderById,
  getOrderItems,
  updateOrderStatus,
} from '@/lib/services/orderService';
import { getCurrentSession } from '@/lib/services/adminService';
import { Order, OrderItem } from '@/types/order';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<Order | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);

  const [successMessage, setSuccessMessage] = useState('');

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    document.title = 'Order Details - ORDA';

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await getCurrentSession();

        if (!session) {
          router.replace('/admin/login');
          return;
        }

        const orderData = await getOrderById(Number(params.id));

        const itemData = await getOrderItems(Number(params.id));

        setOrder(orderData);

        setItems(itemData as OrderItem[]);
      } catch (error) {
        console.error(error);

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [params.id, router]);

  async function handleStatusChange(status: string) {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, status);

      setOrder({
        ...order,
        status,
      });

      setSuccessMessage(`Order marked as ${status}`);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  }

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

  if (notFound || !order) {
    return (
      <div className="page">
        <div className="container">
          <div className="card not-found-card">
            <h2>Order Not Found</h2>

            <p>This order may have been deleted or does not exist.</p>

            <Link href="/admin/dashboard" className="back-btn">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #faf7f2;
            padding: 32px;
            font-family: 'Georgia', 'Times New Roman', serif;
          }

          .container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .not-found-card {
            background: white;
            border-radius: 24px;
            padding: 48px;
            margin-top: 60px;
            text-align: center;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          }

          .not-found-card h2 {
            margin-bottom: 12px;
            color: #2c1a0e;
          }

          .not-found-card p {
            color: #9e836b;
            margin-bottom: 24px;
          }

          .back-btn {
            display: inline-block;
            background: #2c1a0e;
            color: white;
            padding: 12px 18px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page">
      {successMessage && <div className="toast">✓ {successMessage}</div>}
      <div className="container">
        <h1 className="top-head">Orders Details</h1>

        <div className="top-bar">
          <Link href="/admin/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <div className="header">
            <div>
              <h1>{order.order_number}</h1>

              <p>Customer Order Details</p>
            </div>

            <select
              className="status-select"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="New">New</option>

              <option value="Preparing">Preparing</option>

              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="info-grid">
            <div>
              <span className="label">Customer</span>

              <div className="value">{order.customer_name}</div>
            </div>

            <div>
              <span className="label">Total</span>

              <div className="value">${order.total}</div>
            </div>

            <div>
              <span className="label">Date & Time</span>

              <div className="value">
                {new Date(order.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            </div>

            <div>
              <span className="label">Status</span>

              <div className="value">{order.status}</div>
            </div>
          </div>

          <div className="note-box">
            <span className="label">Customer Note</span>

            <p>{order.note || 'No note provided'}</p>
          </div>
        </div>

        <div className="card">
          <h2>Order Items</h2>

          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <img src={item.products.image} alt={item.products.name} />

                <div className="item-info">
                  <h3>{item.products.name}</h3>

                  <p>Quantity: {item.quantity}</p>

                  <p>Price: ${item.price}</p>
                </div>

                <div className="item-total">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="grand-total">
            Grand Total
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #faf7f2;
          padding: 32px;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        .top-head {
          font-size: 30px;
          margin-left: 20px;
          margin-bottom: 30px;
          font-weight: 600;
        }

        .container {
          max-width: 1100px;
          margin: auto;
        }

        .top-bar {
          margin-bottom: 20px;
        }

        .back-btn {
          background: #2c1a0e;
          color: white;
          padding: 12px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
        }

        .card {
          background: white;
          border-radius: 24px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        h1,
        h2 {
          margin: 0;
          color: #2c1a0e;
          font-family: Georgia, serif;
        }

        .header p {
          color: #9e836b;
        }

        .status-select {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .label {
          color: #9e836b;
          font-size: 12px;
          text-transform: uppercase;
        }

        .value {
          margin-top: 6px;
          font-size: 17px;
          font-weight: 600;
          color: #2c1a0e;
        }

        .note-box {
          background: #faf7f2;
          border-radius: 14px;
          padding: 18px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .item-card {
          display: flex;
          gap: 16px;
          align-items: center;
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 16px;
        }

        .item-card img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 12px;
        }

        .item-info {
          flex: 1;
        }

        .item-info h3 {
          margin: 0 0 8px;
          color: #2c1a0e;
        }

        .item-info p {
          margin: 4px 0;
          color: #9e836b;
        }

        .item-total {
          font-size: 22px;
          font-weight: 700;
          color: #c8813a;
        }

        .grand-total {
          text-align: right;
          margin-top: 24px;
          font-size: 24px;
          font-weight: 700;
          color: #2c1a0e;
        }

        .grand-total span {
          color: #c8813a;
          margin-left: 10px;
        }

        .loading {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #faf7f2;
        }

        @media (max-width: 768px) {
          .page {
            padding: 16px;
          }

          .header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .item-card {
            flex-direction: column;
            text-align: center;
          }

          .item-card img {
            width: 200px;
            height: 200px;
          }

          .grand-total {
            text-align: center;
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
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
