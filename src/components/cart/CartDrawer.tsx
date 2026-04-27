'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Text from '@/components/text/Text';
import Button from '@/components/buttons/Button';
import { formatPrice } from '@/utils/shopify';
import { useCart } from './CartContext';
import styles from './cart-drawer.module.css';

const CartDrawer = () => {
  const { isOpen, cart, closeCart, setCart } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fokuser lukk-knapp når skuffen åpnes
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Lukk med Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  // Lås scroll på body — position:fixed er nødvendig på iOS Safari
  // overflow:hidden alene fungerer ikke og lar touch-events henge igjen
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lines = cart?.lines.edges.map(({ node }) => node) ?? [];

  async function handleRemove(lineId: string) {
    setRemoving(lineId);
    try {
      const res = await fetch('/api/nettbutikk/cart/lines', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } finally {
      setRemoving(null);
    }
  }

  async function handleQuantity(lineId: string, newQuantity: number) {
    if (newQuantity < 1) {
      return handleRemove(lineId);
    }
    setUpdating(lineId);
    try {
      const res = await fetch('/api/nettbutikk/cart/lines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <div className={styles.backdrop} onClick={closeCart} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Handlekurv"
        className={styles.drawer}
      >
        <div className={styles.header}>
          <Text type="h2">Handlekurv</Text>
          <button
            ref={closeRef}
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Lukk handlekurv"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <Text type="body">Handlekurven er tom.</Text>
          </div>
        ) : (
          <>
            <ul className={styles.items} role="list">
              {lines.map((line) => {
                const { merchandise } = line;
                const isDefaultVariant = merchandise.title === 'Default Title';

                return (
                  <li key={line.id} className={styles.item}>
                    {merchandise.image && (
                      <div className={styles.itemImage} aria-hidden="true">
                        <Image
                          src={merchandise.image.url}
                          alt={merchandise.image.altText ?? merchandise.product.title}
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.itemDetails}>
                      <Text type="bodyLarge">{merchandise.product.title}</Text>
                      {!isDefaultVariant && (
                        <Text type="body">{merchandise.title}</Text>
                      )}
                      <Text type="body">
                        {formatPrice(merchandise.price.amount, merchandise.price.currencyCode)}
                      </Text>
                      <div className={styles.quantityRow}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantity(line.id, line.quantity - 1)}
                          disabled={updating === line.id || removing === line.id}
                          aria-label="Reduser antall"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M4.16602 9.99731H15.8295" stroke="currentColor" strokeWidth="1.66622" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span className={styles.quantityValue}>{line.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantity(line.id, line.quantity + 1)}
                          disabled={updating === line.id || removing === line.id}
                          aria-label="Øk antall"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M4.16602 9.99731H15.8295" stroke="currentColor" strokeWidth="1.66622" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.99805 4.16553V15.829" stroke="currentColor" strokeWidth="1.66622" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemove(line.id)}
                      disabled={removing === line.id || updating === line.id}
                      aria-label={`Fjern ${merchandise.product.title} fra handlekurven`}
                    >
                      {removing === line.id ? 'Fjerner…' : 'Fjern'}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={styles.footer}>
              <div className={styles.total}>
                <Text type="bodyLarge">Totalt</Text>
                <Text type="bodyLarge">
                  {formatPrice(cart!.cost.totalAmount.amount, cart!.cost.totalAmount.currencyCode)}
                </Text>
              </div>
              <Button
                type="primary"
                onClick={() => { window.location.href = cart!.checkoutUrl; }}
              >
                Gå til kassen
              </Button>
              <Text type="small">Betaling og utsendelse håndteres av getMerch.</Text>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
