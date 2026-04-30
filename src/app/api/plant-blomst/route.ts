import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const limiter = new Map<string, { count: number; reset: number }>();
const MAX = 3;
const WINDOW = 60 * 60 * 1000;

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const entry = limiter.get(ip);
  if (!entry || now > entry.reset) {
    limiter.set(ip, { count: 1, reset: now + WINDOW });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count++;
  return true;
}

function sanitize(val: unknown, maxLen: number): string | undefined {
  if (typeof val !== "string") return undefined;
  const trimmed = val.replace(/<[^>]*>/g, "").trim();
  return trimmed.length > 0 ? trimmed.slice(0, maxLen) : undefined;
}

const GYLDIGE_TYPER = [
  "snoklokke",
  "alperose",
  "dahlia",
  "krokus",
  "prestekrage",
  "forglemmegei",
];

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!allowRequest(ip)) {
    return NextResponse.json(
      { error: "For mange forsøk. Prøv igjen om en time." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ugyldig forespørsel." },
      { status: 400 },
    );
  }

  // Honeypot: bots fill this field, humans don't — silently succeed to avoid fingerprinting
  if (body.url && typeof body.url === "string" && body.url.length > 0) {
    return NextResponse.json({ success: true });
  }

  const blomstType = sanitize(body.blomstType, 20);
  if (!blomstType || !GYLDIGE_TYPER.includes(blomstType)) {
    return NextResponse.json({ error: "Ugyldig blomsttype." }, { status: 400 });
  }

  const tilMinneOm = sanitize(body.tilMinneOm, 100);
  const hilsen = sanitize(body.hilsen, 150);
  const navn = sanitize(body.navn, 60);

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    console.error("SANITY_API_WRITE_TOKEN mangler");
    return NextResponse.json({ error: "Konfigurasjonsfeil." }, { status: 500 });
  }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    token: writeToken,
    useCdn: false,
  });

  // Blomster uten tekst trenger ikke manuell gjennomgang
  const harTekst = tilMinneOm || hilsen || navn;
  const autoGodkjent = !harTekst;

  try {
    const doc = await client.create({
      _type: "blomst",
      blomstType,
      ...(tilMinneOm && { tilMinneOm }),
      ...(hilsen && { hilsen }),
      ...(navn && { navn }),
      godkjent: autoGodkjent,
      plantetDato: new Date().toISOString(),
    });

    // Send e-postvarsling kun for blomster med tekst som trenger gjennomgang
    if (harTekst) {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        const blomstNavn =
          blomstType.charAt(0).toUpperCase() + blomstType.slice(1);
        const detaljer = [
          tilMinneOm && `Til minne om: ${tilMinneOm}`,
          hilsen && `Hilsen: ${hilsen}`,
          navn ? `Plantet av: ${navn}` : "Plantet av: Anonym",
        ]
          .filter(Boolean)
          .join("\n");

        await resend.emails
          .send({
            from: "Minnehagen <noreply@pmdd.no>",
            to: "christina@pmdd.no",
            subject: `🌸 Ny blomst plantet i minnehagen — ${blomstNavn}`,
            text: `En ny blomst venter på godkjenning i Sanity Studio.\n\n${detaljer}\n\nGodkjenn her: https://pmdd-norge.sanity.studio/structure/blomst%3B${doc._id}`,
          })
          .catch((err) => console.error("E-postvarsling feilet:", err));
      }
    }

    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Sanity write feil:", err);
    return NextResponse.json(
      { error: "Kunne ikke plante blomsten. Prøv igjen." },
      { status: 500 },
    );
  }
}
