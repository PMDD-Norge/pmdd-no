import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const reference = typeof body.reference === 'string' ? body.reference : null;
  const name = typeof body.name === 'string' ? body.name : null;

  if (!reference || !name) {
    return NextResponse.json({ ok: true });
  }

  if (name !== 'AUTHORIZED' && name !== 'SALE') {
    return NextResponse.json({ ok: true });
  }

  // Format: BLOMST-{sanityId}-{timestamp} — sanityId itself contains hyphens
  const blomstId = reference.replace(/^BLOMST-/, '').replace(/-\d+$/, '');

  if (!blomstId) {
    return NextResponse.json({ ok: true });
  }

  const rawAmount =
    typeof body.amount === 'object' &&
    body.amount !== null &&
    typeof (body.amount as Record<string, unknown>).value === 'number'
      ? (body.amount as Record<string, unknown>).value as number
      : null;

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    console.error('SANITY_API_WRITE_TOKEN mangler');
    return NextResponse.json({ ok: true });
  }

  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      token: writeToken,
      useCdn: false,
    });

    const patch = client.patch(blomstId).set({
      vippsOrderId: reference,
      ...(rawAmount !== null && { donertBeloep: rawAmount / 100 }),
    });

    await patch.commit();
  } catch (err) {
    console.error('Sanity patch feil i Vipps callback:', err);
  }

  return NextResponse.json({ ok: true });
}
