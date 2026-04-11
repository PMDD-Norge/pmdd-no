'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ShopifyCart } from '@/utils/shopify';

interface CartContextType {
  isOpen: boolean;
  cart: ShopifyCart | null;
  openCart: () => void;
  closeCart: () => void;
  setCart: (cart: ShopifyCart | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<ShopifyCart | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Hent eksisterende cart fra cookie på mount
  useEffect(() => {
    fetch('/api/nettbutikk/cart')
      .then((res) => res.json())
      .then((data) => { if (data.cart) setCart(data.cart); })
      .catch(() => {});
  }, []);

  return (
    <CartContext.Provider value={{ isOpen, cart, openCart, closeCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart må brukes innenfor CartProvider');
  return ctx;
}
