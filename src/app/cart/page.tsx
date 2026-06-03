'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import Header from '@/components/Header';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'ORDA - Cart';

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = subtotal;

  return (
    <div className="cart-page">
      <Header />
      <main className="min-h-screen bg-[#F6F3EF]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-[#2F160A]">Your Cart</h1>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 font-medium clear-cart"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
              <h2 className="text-2xl font-semibold text-[#2F160A] mb-3">
                Your cart is empty
              </h2>

              <p className="text-gray-500 mb-6">
                Add some delicious items from our menu.
              </p>

              <Link
                href="/"
                className="inline-flex items-center justify-center bg-[#2F160A] text-white px-6 py-3 rounded-xl"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              {/* Cart Items */}
              <div className="space-y-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl shadow-sm p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-[#2F160A]">
                          {item.name}
                        </h2>

                        <p className="text-[#8B7355] text-sm mt-1">
                          {item.description}
                        </p>

                        <p className="text-[#D07A32] font-bold text-lg mt-3">
                          ${item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-5">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-9 h-9 rounded-full bg-[#2F160A] text-white flex items-center justify-center qty-change"
                            >
                              −
                            </button>

                            <span className="font-semibold text-lg min-w-[24px] text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-9 h-9 rounded-full bg-[#2F160A] text-white flex items-center justify-center qty-change"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 font-medium remove-item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-3xl shadow-sm p-6 h-fit sticky top-6">
                <h2 className="text-2xl font-bold text-[#2F160A] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({items.length})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold text-[#2F160A]">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center bg-[#2F160A] text-white py-4 rounded-2xl mt-8 hover:opacity-90 transition"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full text-center border border-[#D8D0C8] text-[#2F160A] py-4 rounded-2xl mt-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .min-h-screen {
            min-height: 100vh;
            background: #faf7f2;
            font-family: 'Georgia', 'Times New Roman', serif;
            padding-bottom: 100px;
          }
          .clear-cart,
          .remove-item,
          .qty-change {
            cursor: pointer;
          }
        `}</style>
      </main>
    </div>
  );
}
