import { readBaseUrl } from "@/lib/env";
import type { MetadataRoute } from "next";
import { logger, logError } from '@/utils/logger';

export default function robots(): MetadataRoute.Robots {
  const robotsFile: MetadataRoute.Robots = {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio", // Sanity Studio
        "/api", // API routes
        "/_next", // Next.js system files
        "/preview", // Preview routes
      ],
    },
  };

  const baseUrlResult = readBaseUrl();

  if (baseUrlResult.ok) {
    try {
      robotsFile.sitemap = new URL(
        "sitemap.xml",
        baseUrlResult.value
      ).toString();
    } catch (error) {
      logError(error, { context: "Constructing sitemap URL" });
    }
  } else {
    logger.warn("Could not include sitemap in robots.txt, missing base url", {
      error: baseUrlResult.error
    });
  }

  return robotsFile;
}
