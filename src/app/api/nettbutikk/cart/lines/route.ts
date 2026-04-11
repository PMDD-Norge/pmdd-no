import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { removeCartLine, updateCartLine } from '@/utils/shopify';

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('shopify_cart_id')?.value;

  if (!cartId) {
    return NextResponse.json({ error: 'Ingen handlekurv funnet' }, { status: 400 });
  }

  const { lineId, quantity } = await request.json();

  try {
    const cart = await updateCartLine(cartId, lineId, quantity);
    return NextResponse.json({ cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Noe gikk galt';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('shopify_cart_id')?.value;

  if (!cartId) {
    return NextResponse.json({ error: 'Ingen handlekurv funnet' }, { status: 400 });
  }

  const { lineId } = await request.json();

  try {
    const cart = await removeCartLine(cartId, lineId);
    return NextResponse.json({ cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Noe gikk galt';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
