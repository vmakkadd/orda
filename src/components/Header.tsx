'use client';

import Link from 'next/link';
import useCartStore from '@/store/cartStore';

export default function Header() {
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand-link">
          <div className="brand">
            <span className="brand-icon">☕</span>
            <div className="brand-wrap">
              <h1 className="brand-name">ORDA</h1>
              <p className="brand-sub">Order with ease</p>
            </div>
          </div>
        </Link>
        {totalItems > 0 && (
          <Link href="/cart" className="cart-pill">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{totalItems}</span>
            <span className="cart-price">${totalPrice.toFixed(2)}</span>
          </Link>
        )}
      </div>
      <style jsx>{`
        /* ── Header ── */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 247, 242, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e0d4;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        /* Cart pill in header (shown on desktop / large screens) */
        .cart-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #2c1a0e;
          color: #faf7f2;
          border-radius: 999px;
          padding: 8px 14px;
          text-decoration: none;
          font-size: 13px;
          font-family: 'Arial', sans-serif;
          transition: background 0.2s;
        }
        .cart-pill:hover {
          background: #4a2e18;
        }
        .cart-count {
          background: #c8813a;
          color: #fff;
          border-radius: 999px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 700;
        }
      `}</style>
    </header>
  );
}
