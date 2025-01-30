import { readBaseUrl } from "@/lib/env";
import type { MetadataRoute } from "next";

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
      console.error("Failed to construct sitemap URL:", error);
    }
  } else {
    console.warn(
      "Could not include sitemap in robots.txt, missing base url:",
      baseUrlResult.error
    );
  }

  return robotsFile;
}
