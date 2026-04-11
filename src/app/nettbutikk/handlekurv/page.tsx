import { cookies } from 'next/headers';
import { getCart } from '@/utils/shopify';
import CartPage from '@/components/pages/merch/CartPage';

export default async function Page() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('shopify_cart_id')?.value;
  const cart = cartId ? await getCart(cartId) : null;

  return <CartPage cart={cart} />;
}
