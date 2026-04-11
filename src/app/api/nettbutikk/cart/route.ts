import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCart, addCartLine, getCart } from '@/utils/shopify';

const CART_COOKIE = 'shopify_cart_id';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 dager
  path: '/',
};

export async function GET() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  const cart = await getCart(cartId);
  return NextResponse.json({ cart });
}

export async function POST(request: Request) {
  const { variantId, quantity } = await request.json();
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  let cart;

  try {
    cart = existingCartId
      ? await addCartLine(existingCartId, variantId, quantity)
      : await createCart(variantId, quantity);
  } catch {
    // Eksisterende cart kan ha utløpt — lag ny
    try {
      cart = await createCart(variantId, quantity);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Noe gikk galt';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const response = NextResponse.json({ cart });
  response.cookies.set(CART_COOKIE, cart.id, COOKIE_OPTIONS);
  return response;
}
