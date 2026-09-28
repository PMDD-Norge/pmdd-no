import { getDocumentTypeBySlug } from "@/utils/queries";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import {
  contentTypeHandlers,
  ContentType,
  SearchParams,
} from "./contentTypeHandlers";
import { DEFAULT_LANGUAGE } from "@/constants";
import { generatePageMetadata, getLastSlug } from "@/utils/metadata";
import { logger, logError } from "@/utils/logger";
import { permanentRedirect } from "next/navigation";
import { getDocumentPath, harSeksjonsprefiks } from "@/utils/documentUrl";

export const revalidate = 86400; // ISR: 24 hours - regenerate daily
export const dynamicParams = true; // Enable ISR for new pages

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<SearchParams>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lastSlug = getLastSlug(slug);
  return generatePageMetadata(lastSlug);
}

/**
 * Dynamic page component - now much cleaner with handler registry
 * Reduced from 408 lines to ~100 lines
 */
export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const language = DEFAULT_LANGUAGE;

  if (!slug?.length) {
    return <PMDDErrorMessage />;
  }

  // Get document type
  const { data: docType } = await getDocumentTypeBySlug(slug, language);

  if (!docType) {
    return <PMDDErrorMessage />;
  }

  // Dokumenttyper som hører under en seksjon har sin egen rute
  // (f.eks. /informasjon/<slug>). Havner en forespørsel likevel her, kommer den
  // fra en gammel toppnivå-URL – send den videre til den kanoniske adressen så
  // samme innhold ikke svarer på to steder.
  if (harSeksjonsprefiks(docType)) {
    permanentRedirect(getDocumentPath(docType, slug[slug.length - 1]));
  }

  // Map legacy document types to current types
  // "information" and "highlights" were legacy types, now they're all collectionHub
  const legacyTypeMap: Record<string, ContentType> = {
    information: "collectionHub",
    highlights: "collectionHub",
    // Artikler på informasjonssiden har egen dokumenttype, men rendres som artikkel
    informasjonsartikkel: "article",
    // Informasjonssiden har egen dokumenttype, men rendres av hub-handleren
    informasjonsdokument: "collectionHub",
  };

  const mappedType = (legacyTypeMap[docType] || docType) as ContentType;

  // Get the appropriate handler from the registry
  const handler = contentTypeHandlers[mappedType];

  if (!handler) {
    logger.warn(`No handler found for document type: ${mappedType}`, {
      originalType: docType,
      mappedType,
      slug
    });
    return <PMDDErrorMessage />;
  }

  // Log legacy type usage for migration tracking
  if (docType !== mappedType) {
    logger.info(`Legacy document type mapped: ${docType} → ${mappedType}`, {
      originalType: docType,
      mappedType,
      slug,
    });
  }

  // Execute the handler - all handlers now have the same signature
  try {
    return await handler(slug, language, resolvedSearchParams);
  } catch (error) {
    logError(error, {
      originalType: docType,
      mappedType,
      slug,
      message: `Error handling ${mappedType}`
    });
    return <PMDDErrorMessage />;
  }
}
