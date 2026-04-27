import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function verifyVippsSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.VIPPS_WEBHOOK_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get('authorization') ?? '';
  const date = req.headers.get('x-ms-date') ?? req.headers.get('date') ?? '';
  const host = req.headers.get('host') ?? '';
  const contentHashHeader = req.headers.get('x-ms-content-sha256') ?? '';

  // Verify body hash
  const bodyHash = createHmac('sha256', Buffer.from(secret))
    .update(rawBody)
    .digest('base64');

  if (contentHashHeader && contentHashHeader !== bodyHash) return false;

  // Verify HMAC signature
  const url = new URL(req.url);
  const pathAndQuery = url.pathname + (url.search ?? '');
  const stringToSign = `POST\n${pathAndQuery}\n${date};${host};${bodyHash}`;

  const expectedSig = createHmac('sha256', Buffer.from(secret))
    .update(stringToSign)
    .digest('base64');

  const signatureMatch = authHeader.includes(expectedSig);
  return signatureMatch;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!verifyVippsSignature(req, rawBody)) {
    console.error('Vipps webhook: ugyldig signatur');
    return NextResponse.json({ ok: true }); // alltid 200 til Vipps
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const reference = typeof body.reference === 'string' ? body.reference : null;
  const eventName = typeof body.name === 'string' ? body.name : null;

  if (!reference || !eventName) return NextResponse.json({ ok: true });

  const GODKJENTE_EVENTS = [
    'epayments.payment.authorized.v1',
    'epayments.payment.captured.v1',
  ];
  if (!GODKJENTE_EVENTS.includes(eventName)) return NextResponse.json({ ok: true });

  // Format: BLOMST-{sanityId}-{timestamp} — sanityId itself contains hyphens
  const blomstId = reference.replace(/^BLOMST-/, '').replace(/-\d+$/, '');
  if (!blomstId) return NextResponse.json({ ok: true });

  const rawAmount =
    typeof body.amount === 'object' &&
    body.amount !== null &&
    typeof (body.amount as Record<string, unknown>).value === 'number'
      ? ((body.amount as Record<string, unknown>).value as number)
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

    await client.patch(blomstId).set({
      vippsOrderId: reference,
      ...(rawAmount !== null && { donertBeloep: rawAmount / 100 }),
    }).commit();
  } catch (err) {
    console.error('Sanity patch feil i Vipps callback:', err);
  }

  return NextResponse.json({ ok: true });
}
