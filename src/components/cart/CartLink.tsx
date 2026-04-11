'use client';

import Link from 'next/link';
import { useCart } from './CartContext';
import buttonStyles from '@/components/buttons/button.module.css';

const CartLink = () => {
  const { cart } = useCart();
  const itemCount =
    cart?.lines.edges.reduce((sum, { node }) => sum + node.quantity, 0) ?? 0;

  if (itemCount === 0) return null;

  return (
    <Link
      href="/nettbutikk/handlekurv"
      className={`${buttonStyles.button} ${buttonStyles.small} ${buttonStyles.secondary}`}
    >
      Vis handlekurv ({itemCount})
    </Link>
  );
};

export default CartLink;
