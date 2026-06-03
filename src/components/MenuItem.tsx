'use client';

import { Product } from '../types/product';
import useCartStore from '../store/cartStore';

interface MenuItemProps {
  product: Product;
  index: number;
}

export default function MenuItem({ product, index }: MenuItemProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = cartItems.find((item) => item.id === product.id);

  const quantity = cartItem?.quantity || 0;

  return (
    <div className="card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="img"
          loading="lazy"
        />
      </div>

      <div className="body">
        <h3 className="name">{product.name}</h3>

        <p className="desc">{product.description}</p>

        <div className="footer">
          <span className="price">${product.price.toFixed(2)}</span>

          {quantity === 0 ? (
            <button
              className="add-btn"
              onClick={() => addItem(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              ADD
            </button>
          ) : (
            <div className="qty-control">
              <button onClick={() => updateQuantity(product.id, quantity - 1)}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={() => updateQuantity(product.id, quantity + 1)}>
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(44, 26, 14, 0.07);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.4s ease both;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(44, 26, 14, 0.12);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .img-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .card:hover .img {
          transform: scale(1.05);
        }

        .body {
          padding: 16px 16px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }

        .name {
          font-size: 17px;
          font-weight: 700;
          color: #2c1a0e;
          margin: 0;
          font-family: 'Georgia', serif;
          line-height: 1.2;
        }

        .desc {
          font-size: 13px;
          color: #9e836b;
          margin: 0;
          font-family: Arial, sans-serif;
          line-height: 1.4;
          flex: 1;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #c8813a;
          font-family: 'Georgia', serif;
        }

        .add-btn {
          min-width: 72px;
          height: 36px;

          border: none;
          border-radius: 999px;

          background: #2c1a0e;
          color: #faf7f2;

          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .add-btn:hover {
          background: #4a2e18;
        }

        .qty-control {
          width: 90px;
          height: 36px;

          background: #2c1a0e;
          border-radius: 999px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 8px;
        }

        .qty-control button {
          border: none;
          background: transparent;

          color: #faf7f2;

          width: 24px;
          height: 24px;

          font-size: 18px;
          font-weight: 700;

          cursor: pointer;
        }

        .qty-control span {
          color: #faf7f2;
          font-size: 14px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
