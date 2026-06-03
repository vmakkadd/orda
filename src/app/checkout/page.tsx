'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import Header from '@/components/Header';
import { createOrder } from '@/lib/services/orderService';

export default function CheckoutPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    document.title = 'ORDA - Checkout';

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        note,
        total: subtotal,
        items,
      });

      clearCart();

      router.push(`/checkout/success?order=${order.order_number}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

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

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="page">
          <div className="empty-wrap">
            <span className="empty-icon">☕</span>
            <p className="empty-title">Nothing to checkout</p>
            <p className="empty-sub">Your cart is empty</p>
            <Link href="/" className="back-to-menu">
              Browse Menu
            </Link>
          </div>
          <style jsx>{`
            .page {
              min-height: 100vh;
              background: #faf7f2;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Georgia', 'Times New Roman', serif;
            }
            .empty-wrap {
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
            }
            .empty-icon {
              font-size: 52px;
              opacity: 0.4;
            }
            .empty-title {
              font-size: 22px;
              font-weight: 700;
              color: #2c1a0e;
              margin: 0;
            }
            .empty-sub {
              font-size: 14px;
              color: #9e836b;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .back-to-menu {
              margin-top: 8px;
              background: #2c1a0e;
              color: #faf7f2;
              padding: 12px 28px;
              border-radius: 12px;
              text-decoration: none;
              font-size: 14px;
              font-family: Arial, sans-serif;
              font-weight: 600;
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="page">
        <main className="main">
          <div className="layout">
            <div className="form-col">
              <h1 className="page-title">Checkout</h1>

              {error && <div className="error-box">⚠️ {error}</div>}

              {/* Customer Details */}
              <div className="section-card">
                <h2 className="section-title">
                  <span className="section-num">1</span>
                  Your Details
                </h2>

                <div className="field">
                  <label className="label" htmlFor="name">
                    Your Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    placeholder="e.g. Alex Johnson"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="note">
                    Special Note
                    <span className="optional"> (optional)</span>
                  </label>
                  <textarea
                    id="note"
                    className="textarea"
                    placeholder="e.g. Extra hot, oat milk, no sugar…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Order Review */}
              <div className="section-card">
                <h2 className="section-title">
                  <span className="section-num">2</span>
                  Review Order
                </h2>

                <div className="review-list">
                  {items.map((item) => (
                    <div key={item.id} className="review-item">
                      <div className="review-img-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="review-img"
                        />
                      </div>
                      <div className="review-info">
                        <span className="review-name">{item.name}</span>
                        <span className="review-qty">× {item.quantity}</span>
                      </div>
                      <span className="review-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href="/cart" className="edit-cart-link">
                  Edit cart →
                </Link>
              </div>
            </div>

            {/* ── Right: Summary + CTA ── */}
            <div className="summary-col">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-lines">
                  {items.map((item) => (
                    <div key={item.id} className="summary-line">
                      <span className="summary-line-label">
                        {item.name}
                        <span className="summary-line-qty">
                          {' '}
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="summary-line-val">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-price">${subtotal.toFixed(2)}</span>
                </div>

                <div className="items-badge">
                  {totalItems} item{totalItems > 1 ? 's' : ''}
                </div>

                <button
                  className={`place-btn ${loading ? 'place-btn--loading' : ''}`}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-inner">
                      <span className="spinner" />
                      Placing Order…
                    </span>
                  ) : (
                    'Place Order ✓'
                  )}
                </button>

                <p className="secure-note">🔒 Your order is saved securely</p>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          /* ── Base ── */
          .page {
            min-height: 100vh;
            background: #faf7f2;
            font-family: 'Georgia', 'Times New Roman', serif;
          }

          /* ── Header ── */
          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(250, 247, 242, 0.94);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid #e8e0d4;
          }
          .header-inner {
            max-width: 1100px;
            margin: 0 auto;
            padding: 14px 32px;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
          }
          .back-btn {
            color: #7a5c40;
            text-decoration: none;
            font-size: 14px;
            font-family: Arial, sans-serif;
            transition: color 0.2s;
          }
          .back-btn:hover {
            color: #2c1a0e;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 20px;
          }
          .brand-name {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.12em;
            color: #2c1a0e;
          }

          /* ── Layout ── */
          .main {
            max-width: 1100px;
            margin: 0 auto;
            padding: 36px 32px 80px;
          }
          .layout {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 36px;
            align-items: start;
          }
          .page-title {
            font-size: 28px;
            font-weight: 700;
            color: #2c1a0e;
            margin: 0 0 24px;
          }

          /* ── Section Cards ── */
          .section-card {
            background: #fff;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 2px 12px rgba(44, 26, 14, 0.06);
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #2c1a0e;
            margin: 0 0 22px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .section-num {
            width: 28px;
            height: 28px;
            background: #2c1a0e;
            color: #faf7f2;
            border-radius: 50%;
            font-size: 13px;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          /* ── Form Fields ── */
          .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 18px;
          }
          .field:last-child {
            margin-bottom: 0;
          }
          .label {
            font-size: 14px;
            font-weight: 600;
            color: #2c1a0e;
            font-family: Arial, sans-serif;
          }
          .required {
            color: #c8813a;
          }
          .optional {
            color: #9e836b;
            font-weight: 400;
            font-size: 12px;
          }
          .input,
          .textarea {
            width: 100%;
            padding: 14px 16px;
            border: 1.5px solid #e0d6c8;
            border-radius: 12px;
            font-size: 15px;
            font-family: Arial, sans-serif;
            color: #2c1a0e;
            background: #faf7f2;
            outline: none;
            transition:
              border-color 0.2s,
              box-shadow 0.2s;
            box-sizing: border-box;
            resize: none;
          }
          .input::placeholder,
          .textarea::placeholder {
            color: #b8a080;
          }
          .input:focus,
          .textarea:focus {
            border-color: #c8813a;
            box-shadow: 0 0 0 3px rgba(200, 129, 58, 0.12);
            background: #fff;
          }
          .input:disabled,
          .textarea:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* ── Review List ── */
          .review-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
          }
          .review-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 10px;
            background: #faf7f2;
            border-radius: 12px;
          }
          .review-img-wrap {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
          }
          .review-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .review-info {
            flex: 1;
            display: flex;
            align-items: baseline;
            gap: 6px;
          }
          .review-name {
            font-size: 14px;
            font-weight: 600;
            color: #2c1a0e;
            font-family: Arial, sans-serif;
          }
          .review-qty {
            font-size: 13px;
            color: #9e836b;
            font-family: Arial, sans-serif;
          }
          .review-price {
            font-size: 15px;
            font-weight: 700;
            color: #c8813a;
            font-family: Georgia, serif;
            flex-shrink: 0;
          }
          .edit-cart-link {
            font-size: 13px;
            color: #8a6f55;
            font-family: Arial, sans-serif;
            text-decoration: none;
            border-bottom: 1px solid #d4c4ae;
            padding-bottom: 1px;
            transition: color 0.2s;
          }
          .edit-cart-link:hover {
            color: #2c1a0e;
          }

          /* ── Error ── */
          .error-box {
            background: #fff0ef;
            border: 1.5px solid #f0c0b8;
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 14px;
            color: #b94040;
            font-family: Arial, sans-serif;
            margin-bottom: 20px;
          }

          /* ── Summary Card ── */
          .summary-col {
            position: sticky;
            top: 80px;
          }
          .summary-card {
            background: #fff;
            border-radius: 20px;
            padding: 28px 24px;
            box-shadow: 0 4px 24px rgba(44, 26, 14, 0.08);
          }
          .summary-title {
            font-size: 20px;
            font-weight: 700;
            color: #2c1a0e;
            margin: 0 0 20px;
          }
          .summary-lines {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .summary-line {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: 14px;
            font-family: Arial, sans-serif;
          }
          .summary-line-label {
            color: #5a4030;
            flex: 1;
            padding-right: 8px;
          }
          .summary-line-qty {
            color: #9e836b;
            font-size: 13px;
          }
          .summary-line-val {
            color: #2c1a0e;
            font-weight: 600;
            flex-shrink: 0;
          }
          .divider {
            height: 1px;
            background: #e8e0d4;
            margin: 18px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
          }
          .total-label {
            font-size: 17px;
            font-weight: 700;
            color: #2c1a0e;
          }
          .total-price {
            font-size: 26px;
            font-weight: 700;
            color: #c8813a;
          }
          .items-badge {
            font-size: 12px;
            color: #9e836b;
            font-family: Arial, sans-serif;
            margin-bottom: 24px;
            text-align: right;
          }
          .place-btn {
            width: 100%;
            background: #2c1a0e;
            color: #faf7f2;
            border: none;
            border-radius: 14px;
            padding: 18px;
            font-size: 16px;
            font-family: Arial, sans-serif;
            font-weight: 700;
            letter-spacing: 0.04em;
            cursor: pointer;
            transition:
              background 0.2s,
              transform 0.15s;
          }
          .place-btn:hover:not(:disabled) {
            background: #4a2e18;
            transform: translateY(-1px);
          }
          .place-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .place-btn--loading {
            background: #4a2e18;
          }
          .btn-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(250, 247, 242, 0.4);
            border-top-color: #faf7f2;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .secure-note {
            text-align: center;
            font-size: 12px;
            color: #9e836b;
            font-family: Arial, sans-serif;
            margin: 14px 0 0;
          }

          /* ── Mobile ── */
          @media (max-width: 768px) {
            .header-inner {
              padding: 14px 20px;
            }
            .main {
              padding: 24px 16px 60px;
            }
            .layout {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            .summary-col {
              position: static;
            }
            .page-title {
              font-size: 22px;
            }
            .section-card {
              padding: 20px;
            }
            .summary-card {
              padding: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
