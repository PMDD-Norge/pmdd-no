import { client } from "@/sanity/lib/client";
import { MetadataRoute } from "next";

// Content types from Sanity schema (updated)
const CONTENT_TYPES = {
  article: "article",
  page: "page",
  event: "event",
  collectionHub: "collectionHub",
} as const;

type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// SEO priorities for different content types
const PRIORITIES: Record<ContentType, number> = {
  [CONTENT_TYPES.article]: 0.8,
  [CONTENT_TYPES.page]: 0.7,
  [CONTENT_TYPES.event]: 0.75,
  [CONTENT_TYPES.collectionHub]: 0.7,
};

interface SanityDocument {
  _type: ContentType;
  _id: string;
  _updatedAt: string;
  slug: {
    current: string;
  };
}

async function getAllContent() {
  const query = `*[_type in ["article", "page", "event", "collectionHub"] && defined(slug.current)] {
    _type,
    _id,
    _updatedAt,
    slug
  }`;

  return await client.fetch<SanityDocument[]>(query);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const documents = await getAllContent();
    const routes: MetadataRoute.Sitemap = [];

    // Add homepage
    routes.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    // Add content routes (no language prefix since we're Norwegian only)
    documents.forEach((doc) => {
      if (doc.slug?.current) {
        routes.push({
          url: `${baseUrl}/${doc.slug.current}`,
          lastModified: new Date(doc._updatedAt),
          changeFrequency: "weekly",
          priority: PRIORITIES[doc._type],
        });
      }
    });

    return routes;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to just homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
