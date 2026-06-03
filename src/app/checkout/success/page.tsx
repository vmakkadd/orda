'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import {
  getOrderStatus,
  subscribeToOrderStatus,
  removeSubscription,
} from '@/lib/services/orderService';
import Header from '@/components/Header';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order');

  const [status, setStatus] = useState('New');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    document.title = 'ORDA - Order Placed';

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderId) return;

    getOrderStatus(orderId).then((data) => {
      if (data?.status) {
        setStatus(data.status);
      }
    });

    const channel = subscribeToOrderStatus(orderId, setStatus);

    return () => {
      removeSubscription(channel);
    };
  }, [orderId]);

  if (pageLoading) {
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
    <>
      <Header />
      <div className="page">
        <div className="card">
          <div className="check-wrap">
            <div className="check-circle">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M10 20L17 27L30 13"
                  stroke="#faf7f2"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="title">Order Placed!</h1>
          <p className="subtitle">
            Thank you! Your order is being prepared fresh for you. ☕
          </p>

          {orderId && <div className="order-id-badge">Order #{orderId}</div>}

          <div className="status-strip">
            <div className="status-step">
              <span
                className={`step-dot ${
                  ['New', 'Preparing', 'Completed'].includes(status)
                    ? ''
                    : 'step-dot--inactive'
                }`}
              />
              <span
                className={`step-label ${
                  ['New', 'Preparing', 'Completed'].includes(status)
                    ? ''
                    : 'step-label--inactive'
                }`}
              >
                New
              </span>
            </div>

            <div className="step-line" />

            <div className="status-step">
              <span
                className={`step-dot ${
                  ['Preparing', 'Completed'].includes(status)
                    ? ''
                    : 'step-dot--inactive'
                }`}
              />
              <span
                className={`step-label ${
                  ['Preparing', 'Completed'].includes(status)
                    ? ''
                    : 'step-label--inactive'
                }`}
              >
                Preparing
              </span>
            </div>

            <div className="step-line" />

            <div className="status-step">
              <span
                className={`step-dot ${
                  status === 'Completed' ? '' : 'step-dot--inactive'
                }`}
              />
              <span
                className={`step-label ${
                  status === 'Completed' ? '' : 'step-label--inactive'
                }`}
              >
                Completed
              </span>
            </div>
          </div>

          <Link href="/" className="back-btn">
            Order More →
          </Link>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #faf7f2;
            font-family: Georgia, 'Times New Roman', serif;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .card {
            background: #fff;
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 40px rgba(44, 26, 14, 0.1);
            animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          @keyframes popIn {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(16px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .check-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
          }
          .check-circle {
            width: 80px;
            height: 80px;
            background: #2c1a0e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
          }
          @keyframes scaleIn {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }
          .title {
            font-size: 30px;
            font-weight: 700;
            color: #2c1a0e;
            margin: 0 0 10px;
          }
          .subtitle {
            font-size: 15px;
            color: #7a5c40;
            margin: 0 0 24px;
            font-family: Arial, sans-serif;
            line-height: 1.5;
          }
          .order-id-badge {
            display: inline-block;
            background: #f5f0ea;
            color: #5a4030;
            border-radius: 999px;
            padding: 6px 18px;
            font-size: 13px;
            font-family: Arial, sans-serif;
            font-weight: 600;
            letter-spacing: 0.04em;
            margin-bottom: 32px;
          }

          /* Status Steps */
          .status-strip {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            margin-bottom: 36px;
            padding: 20px 16px;
            background: #faf7f2;
            border-radius: 14px;
          }
          .status-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }
          .step-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #c8813a;
            box-shadow: 0 0 0 4px rgba(200, 129, 58, 0.2);
          }
          .step-dot--inactive {
            background: #d8d0c8;
            box-shadow: none;
          }
          .step-label {
            font-size: 11px;
            font-family: Arial, sans-serif;
            font-weight: 700;
            color: #c8813a;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .step-label--inactive {
            color: #b8a890;
            font-weight: 400;
          }
          .step-line {
            flex: 1;
            height: 2px;
            background: #e0d6c8;
            margin: 0 8px;
            margin-bottom: 18px;
            min-width: 32px;
          }

          .back-btn {
            display: inline-block;
            background: #2c1a0e;
            color: #faf7f2;
            padding: 14px 36px;
            border-radius: 14px;
            text-decoration: none;
            font-size: 15px;
            font-family: Arial, sans-serif;
            font-weight: 700;
            transition:
              background 0.2s,
              transform 0.15s;
          }
          .back-btn:hover {
            background: #4a2e18;
            transform: translateY(-1px);
          }

          @media (max-width: 480px) {
            .card {
              padding: 36px 24px;
            }
            .title {
              font-size: 24px;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
