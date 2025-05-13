import Script from "next/script";
import { SanityLive } from "@/sanity/lib/live";

export default function Analytics() {
  return (
    <>
      <Script
        strategy="lazyOnload" // Changed to lazyOnload to avoid blocking interactive elements
        src="https://analytics.vercel.com/analytics.js"
      />
      <Script
        strategy="lazyOnload"
        src="https://speed-insights.vercel.app/speed-insights.js" 
      />
      <SanityLive />
    </>
  );
}
