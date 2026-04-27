import { NextRequest, NextResponse } from 'next/server';
import { createVippsPayment } from '@/lib/vipps';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
  }

  const { beloep, blomstId } = body;

  if (typeof beloep !== 'number' || beloep < 10) {
    return NextResponse.json({ error: 'Ugyldig beløp. Minimum 10 kr.' }, { status: 400 });
  }

  if (typeof blomstId !== 'string' || blomstId.trim().length === 0) {
    return NextResponse.json({ error: 'Ugyldig blomst-ID.' }, { status: 400 });
  }

  const orderId = `BLOMST-${blomstId.trim()}-${Date.now()}`;
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const returnUrl = `${baseUrl}/minnehagen?donasjon=fullfort`;

  try {
    const { redirectUrl } = await createVippsPayment({
      beloep,
      orderId,
      returnUrl,
      description: 'Donasjon til PMDD Norge - Minnehagen',
    });

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    console.error('Vipps betalingsfeil:', err);
    return NextResponse.json(
      { error: 'Kunne ikke starte Vipps-betaling. Prøv igjen.' },
      { status: 500 }
    );
  }
}
