'use client';

import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import MenuItem from '../components/MenuItem';
import useCartStore from '../store/cartStore';
import Link from 'next/link';
import { getProducts } from '@/lib/services/productService';
import Header from '@/components/Header';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    document.title = 'ORDA - Menu';

    async function fetchProducts() {
      try {
        const data = await getProducts();

        setProducts(data as Product[]);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to load products',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = ['All', 'Coffee', 'Food', 'Drinks'];

  const categoryMap: Record<string, string[]> = {
    Coffee: ['Espresso', 'Cappuccino', 'Flat White'],
    Food: ['Croissant', 'Cheesecake'],
    Drinks: ['Orange Juice'],
  };

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => categoryMap[activeCategory]?.includes(p.name));

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
    <div className="menu-page">
      <Header />

      {/* ── Hero Strip ── */}
      <div className="hero">
        <p className="hero-text">Freshly crafted, made for you ✦</p>
      </div>

      {/* ── Category Tabs ── */}
      <div className="tabs-wrap">
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? 'tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="main">
        {error && (
          <div className="state-wrap">
            <p className="state-text error">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-wrap">
            <p className="state-text">No items found.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid">
            {filtered.map((product, i) => (
              <MenuItem key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* ── Sticky Cart Bar ── */}
      {totalItems > 0 && (
        <div className="cart-bar">
          <div className="cart-bar-inner">
            <span className="cart-bar-info">
              {totalItems} item{totalItems > 1 ? 's' : ''} · $
              {totalPrice.toFixed(2)}
            </span>
            <Link
              href="/cart"
              className="cart-bar-btn"
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
              View Cart →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ── Reset / Base ── */
        .menu-page {
          min-height: 100vh;
          background: #faf7f2;
          font-family: 'Georgia', 'Times New Roman', serif;
          padding-bottom: 100px;
        }

        /* ── Hero ── */
        .hero {
          background: linear-gradient(135deg, #2c1a0e 0%, #4a2e18 100%);
          text-align: center;
          padding: 18px 20px;
        }
        .hero-text {
          color: #f0d9b5;
          font-size: 13px;
          letter-spacing: 0.14em;
          margin: 0;
          text-transform: uppercase;
          font-family: 'Arial', sans-serif;
        }

        /* ── Tabs ── */
        .tabs-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 32px 0;
        }
        .tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tabs::-webkit-scrollbar {
          display: none;
        }
        .tab {
          flex-shrink: 0;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1.5px solid #d4c4ae;
          background: transparent;
          color: #7a5c40;
          font-size: 13px;
          font-family: 'Arial', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .tab:hover {
          border-color: #2c1a0e;
          color: #2c1a0e;
        }
        .tab--active,
        .tab--active:hover {
          background: #2c1a0e;
          border-color: #2c1a0e;
          color: #faf7f2;
        }

        /* ── Main Grid ── */
        .main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 32px 0;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ── State Views ── */
        .state-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 0;
          gap: 14px;
        }
        .state-text {
          color: #8a6f55;
          font-size: 15px;
          font-family: 'Arial', sans-serif;
          margin: 0;
        }
        .state-text.error {
          color: #b94040;
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e8e0d4;
          border-top-color: #2c1a0e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── Sticky Cart Bar ── */
        .cart-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 12px 20px;
          background: rgba(250, 247, 242, 0.95);
          backdrop-filter: blur(12px);
          border-top: 1px solid #e8e0d4;
        }
        .cart-bar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #2c1a0e;
          border-radius: 14px;
          padding: 14px 20px;
        }
        .cart-bar-info {
          color: #f0d9b5;
          font-size: 14px;
          font-family: 'Arial', sans-serif;
        }

        /* ── Responsive ── */
        @media (min-width: 640px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
        /* Mobile: keep compact padding */
        @media (max-width: 480px) {
          .header-inner {
            padding: 14px 20px;
          }
          .tabs-wrap {
            padding: 16px 16px 0;
          }
          .main {
            padding: 16px 16px 0;
          }
          .grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
