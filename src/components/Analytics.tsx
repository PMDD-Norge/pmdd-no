import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SanityLive } from "@/sanity/lib/live";

export default function AnalyticsComponent() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <SanityLive />
    </>
  );
}
