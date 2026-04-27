/**
 * Kjør én gang for å registrere Vipps-webhook:
 *   npx tsx scripts/register-vipps-webhook.ts
 *
 * Lagre "secret" fra responsen som VIPPS_WEBHOOK_SECRET i .env.local og Vercel.
 */

const API_URL = process.env.VIPPS_API_URL ?? 'https://api.vipps.no';
const CLIENT_ID = process.env.VIPPS_CLIENT_ID!;
const CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET!;
const SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY!;
const MSN = process.env.VIPPS_MERCHANT_SERIAL_NUMBER!;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_URL}/api/vipps-callback`;

async function getToken(): Promise<string> {
  const res = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    },
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  console.log('Henter access token...');
  const token = await getToken();

  console.log(`Registrerer webhook → ${CALLBACK_URL}`);
  const res = await fetch(`${API_URL}/webhooks/v1/webhooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Merchant-Serial-Number': MSN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: CALLBACK_URL,
      events: [
        'epayments.payment.authorized.v1',
        'epayments.payment.captured.v1',
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Feil:', data);
    process.exit(1);
  }

  console.log('\n✅ Webhook registrert!');
  console.log('Webhook ID:', data.id);
  console.log('\n⚠️  Legg denne i .env.local og Vercel som VIPPS_WEBHOOK_SECRET:');
  console.log(data.secret);
}

main();
