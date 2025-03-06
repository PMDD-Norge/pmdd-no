import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SanityLive } from "@/sanity/lib/live";

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      <SanityLive />
    </>
  );
}
