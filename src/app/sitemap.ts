import { languages } from "@/i18n/supportedLanguages";
import { client } from "@/sanity/lib/client";
import { MetadataRoute } from "next";

// Content types from Sanity schema
const CONTENT_TYPES = {
  post: "post",
  page: "page",
  legalDocument: "legalDocument",
} as const;

type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// URL structure for different content types
const URL_PATHS: Record<ContentType, string> = {
  [CONTENT_TYPES.post]: "information",
  [CONTENT_TYPES.page]: "",
  [CONTENT_TYPES.legalDocument]: "legal",
};

// SEO priorities for different content types
const PRIORITIES: Record<ContentType, number> = {
  [CONTENT_TYPES.post]: 0.8,
  [CONTENT_TYPES.page]: 0.7,
  [CONTENT_TYPES.legalDocument]: 0.6,
};

interface SanitySlug {
  _key: string;
  value: string;
  _type: "internationalizedArrayStringValue";
}

interface SanityDocument {
  _type: ContentType;
  _id: string;
  _updatedAt: string;
  slug: SanitySlug[];
}

async function getAllContent() {
  const query = `*[_type in ["post", "page", "legalDocument"]] {
    _type,
    _id,
    _updatedAt,
    slug[] {
      _key,
      value
    }
  }`;

  return await client.fetch<SanityDocument[]>(query);
}

function getUrl(doc: SanityDocument, lang: string, baseUrl: string): string {
  const langSlug = doc.slug.find((s: SanitySlug) => s._key === lang)?.value;
  if (!langSlug) return "";

  const pathPrefix = URL_PATHS[doc._type];
  return pathPrefix
    ? `${baseUrl}/${lang}/${pathPrefix}/${langSlug}`
    : `${baseUrl}/${lang}/${langSlug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Define baseUrl at the top of the function
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const documents = await getAllContent();
    const routes: MetadataRoute.Sitemap = [];

    // Add homepage routes for each language
    languages.forEach((lang) => {
      routes.push({
        url: `${baseUrl}/${lang.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      });
    });

    // Add content routes for each language
    documents.forEach((doc) => {
      languages.forEach((lang) => {
        const url = getUrl(doc, lang.id, baseUrl);
        if (url) {
          routes.push({
            url,
            lastModified: new Date(doc._updatedAt),
            changeFrequency: "weekly",
            priority: PRIORITIES[doc._type],
          });
        }
      });
    });

    return routes;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to just homepage routes using baseUrl from outer scope
    return languages.map((lang) => ({
      url: `${baseUrl}/${lang.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    }));
  }
}
