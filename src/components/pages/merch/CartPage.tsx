'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Text from '@/components/text/Text';
import Button from '@/components/buttons/Button';
import { ShopifyCart, formatPrice } from '@/utils/shopify';
import styles from './cart.module.css';
import linkStyles from '@/components/link/link.module.css';

const CartPage = ({ cart }: { cart: ShopifyCart | null }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const lines = cart?.lines.edges.map(({ node }) => node) ?? [];

  async function handleRemove(lineId: string) {
    setRemoving(lineId);
    try {
      await fetch('/api/nettbutikk/cart/lines', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      });
      startTransition(() => router.refresh());
    } finally {
      setRemoving(null);
    }
  }

  async function handleQuantity(lineId: string, newQuantity: number) {
    if (newQuantity < 1) return handleRemove(lineId);
    setUpdating(lineId);
    try {
      await fetch('/api/nettbutikk/cart/lines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity: newQuantity }),
      });
      startTransition(() => router.refresh());
    } finally {
      setUpdating(null);
    }
  }

  if (lines.length === 0) {
    return (
      <article className={styles.wrapper}>
        <Text type="h1">Handlekurv</Text>
        <div className={styles.emptyState}>
          <Text type="body">Handlekurven er tom.</Text>
          <Link href="/nettbutikk" className={linkStyles.link}>
            Gå til nettbutikk
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.wrapper}>
      <div className={styles.header}>
        <Text type="h1">Handlekurv</Text>
        <Link href="/nettbutikk" className={linkStyles.link}>
          Fortsett å handle
        </Link>
      </div>

      <ul className={styles.items} role="list">
            {lines.map((line) => {
              const { merchandise } = line;
              const isDefaultVariant = merchandise.title === 'Default Title';
              const isRemoving = removing === line.id;

              return (
                <li key={line.id} className={styles.item}>
                  {merchandise.image && (
                    <div className={styles.itemImage} aria-hidden="true">
                      <Image
                        src={merchandise.image.url}
                        alt={merchandise.image.altText ?? merchandise.product.title}
                        fill
                        sizes="80px"
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
                      {formatPrice(
                        merchandise.price.amount,
                        merchandise.price.currencyCode
                      )}
                    </Text>
                    <div className={styles.quantityRow}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantity(line.id, line.quantity - 1)}
                        disabled={updating === line.id || isRemoving || isPending}
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
                        disabled={updating === line.id || isRemoving || isPending}
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
                    disabled={isRemoving || updating === line.id || isPending}
                    aria-label={`Fjern ${merchandise.product.title} fra handlekurven`}
                  >
                    {isRemoving ? 'Fjerner…' : 'Fjern'}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.summary}>
            <div className={styles.total}>
              <Text type="bodyLarge">Totalt</Text>
              <Text type="bodyLarge">
                {formatPrice(
                  cart!.cost.totalAmount.amount,
                  cart!.cost.totalAmount.currencyCode
                )}
              </Text>
            </div>
            <Button
              type="primary"
              onClick={() => {
                window.location.href = cart!.checkoutUrl;
              }}
            >
              Gå til kassen
            </Button>
          </div>
    </article>
  );
};

export default CartPage;
