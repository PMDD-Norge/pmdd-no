const VIPPS_API_URL = process.env.VIPPS_API_URL!;
const CLIENT_ID = process.env.VIPPS_CLIENT_ID!;
const CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET!;
const SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY!;
const MERCHANT_SERIAL_NUMBER = process.env.VIPPS_MERCHANT_SERIAL_NUMBER!;

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${VIPPS_API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps token error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function createVippsPayment(params: {
  beloep: number;
  orderId: string;
  returnUrl: string;
  description: string;
}): Promise<{ redirectUrl: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${VIPPS_API_URL}/epayment/v1/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Merchant-Serial-Number': MERCHANT_SERIAL_NUMBER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: {
        value: params.beloep * 100,
        currency: 'NOK',
      },
      paymentMethod: { type: 'WALLET' },
      customer: {},
      reference: params.orderId,
      returnUrl: params.returnUrl,
      userFlow: 'WEB_REDIRECT',
      paymentDescription: params.description,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps payment error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return { redirectUrl: data.redirectUrl as string };
}
