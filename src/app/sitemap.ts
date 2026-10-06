import { client } from "@/sanity/lib/client";
import { MetadataRoute } from "next";
import { logError } from '@/utils/logger';
import { getDocumentPath } from '@/utils/documentUrl';

// Content types from Sanity schema (updated)
const CONTENT_TYPES = {
  article: "article",
  informasjonsartikkel: "informasjonsartikkel",
  informasjonsdokument: "informasjonsdokument",
  minnehagen: "minnehagen",
  stotteOgHjelp: "stotteOgHjelp",
  engasjerDeg: "engasjerDeg",
  aktuelt: "aktuelt",
  nettbutikk: "nettbutikk",
  bliMedlem: "bliMedlem",
  omForeningen: "omForeningen",
  page: "page",
  event: "event",
} as const;

type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// SEO priorities for different content types
const PRIORITIES: Record<ContentType, number> = {
  [CONTENT_TYPES.article]: 0.8,
  [CONTENT_TYPES.informasjonsartikkel]: 0.8,
  [CONTENT_TYPES.informasjonsdokument]: 0.7,
  [CONTENT_TYPES.minnehagen]: 0.7,
  [CONTENT_TYPES.stotteOgHjelp]: 0.7,
  [CONTENT_TYPES.engasjerDeg]: 0.7,
  [CONTENT_TYPES.aktuelt]: 0.75,
  [CONTENT_TYPES.nettbutikk]: 0.7,
  [CONTENT_TYPES.bliMedlem]: 0.7,
  [CONTENT_TYPES.omForeningen]: 0.7,
  [CONTENT_TYPES.page]: 0.7,
  [CONTENT_TYPES.event]: 0.75,
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
  const query = `*[_type in [
    "article",
    "informasjonsartikkel",
    "informasjonsdokument",
    "minnehagen",
    "stotteOgHjelp",
    "engasjerDeg",
    "aktuelt",
    "nettbutikk",
    "bliMedlem",
    "omForeningen",
    "page",
    "event"
  ] && defined(slug.current)] {
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
          url: `${baseUrl}${getDocumentPath(doc._type, doc.slug.current)}`,
          lastModified: new Date(doc._updatedAt),
          changeFrequency: "weekly",
          priority: PRIORITIES[doc._type],
        });
      }
    });

    return routes;
  } catch (error) {
    logError(error, { context: "Generating sitemap" });
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
