/**
 * Content Type Handlers
 * Centralizes the logic for handling different document types in the dynamic page router
 * Reduces duplication and makes the page.tsx file more maintainable
 */

import { PAGINATION } from "@/constants";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGINATED_ARTICLES_QUERY,
  ALL_AKTIVITETER_QUERY,
} from "@/sanity/lib/queries";
import {
  getDocumentBySlug,
  getDocumentWithLandingCheck,
  QueryType,
} from "@/utils/queries";
import {
  Section,
} from "@/sanity/lib/interfaces/pages";
import SectionRenderer from "@/utils/renderSection";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import EventPage from "@/components/pages/event/EventPage";
import ArticlePage from "@/components/pages/article/ArticlePage";
import Legal from "@/components/pages/legal/Legal";
import AvailablePositionPage from "@/components/pages/availablePosition/AvailablePositionPage";
import ProductPage from "@/components/pages/merch/ProductPage";
import { getProductByHandle, getMerchProducts } from "@/utils/shopify";
import { ReactElement } from "react";

/**
 * Shared interface for search params
 */
export interface SearchParams {
  type?: string;
  page?: string;
  category?: string;
}

/**
 * Handler for "page" document type
 */
export async function handlePageType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const result = await getDocumentWithLandingCheck(
    QueryType.Page,
    slug,
    language,
  );
  const document = result.data;
  const landingPageId = result.landingPageId;

  if (!document) {
    return <PMDDErrorMessage />;
  }

  return (
    <>
      {document?.sections?.map((section: Section) => (
        <SectionRenderer
          key={section._key}
          section={section}
          isLandingPage={document._id === landingPageId}
        />
      ))}
    </>
  );
}

/**
 * Handler for "article" document type
 */
export async function handleArticleType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: article } = await getDocumentBySlug(
    QueryType.Article,
    slug,
    language,
  );

  if (!article) {
    return <PMDDErrorMessage />;
  }

  // Route to different components based on article type
  switch (article.type) {
    case "job-position":
      return <AvailablePositionPage document={article} />;
    case "blog-post":
    case "news":
    default:
      return (
        <ArticlePage article={article} currentSlug={slug[slug.length - 1]} />
      );
  }
}

/**
 * Handler for "event" document type
 */
export async function handleEventType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: event } = await getDocumentBySlug(
    QueryType.Event,
    slug,
    language,
  );

  if (!event) {
    return <PMDDErrorMessage />;
  }

  return <EventPage event={event} currentSlug={slug[slug.length - 1]} />;
}

/**
 * Handler for "availablePosition" document type
 */
export async function handleAvailablePositionType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: position } = await getDocumentBySlug(
    QueryType.AvailablePosition,
    slug,
    language,
  );

  if (!position) {
    return <PMDDErrorMessage />;
  }

  return <AvailablePositionPage document={position} />;
}

/**
 * Handler for "minnehagen" document type.
 *
 * Minnehagen er en egen dokumenttype.
 */
export async function handleMinnehagenType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: minnehagen } = await getDocumentBySlug(
    QueryType.Minnehagen,
    slug,
    language,
  );

  if (!minnehagen) {
    return <PMDDErrorMessage />;
  }

  const MinnehagenPage = (
    await import("@/components/pages/minnehagen/MinnehagenPage")
  ).default;

  return <MinnehagenPage document={minnehagen} />;
}

/**
 * Handler for "stotteOgHjelp" document type
 */
export async function handleStotteOgHjelpType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: stotteOgHjelp } = await getDocumentBySlug(
    QueryType.StotteOgHjelp,
    slug,
    language,
  );

  if (!stotteOgHjelp) {
    return <PMDDErrorMessage />;
  }

  const StotteOgHjelpPage = (
    await import("@/components/pages/stotteOgHjelp/StotteOgHjelpPage")
  ).default;

  return <StotteOgHjelpPage document={stotteOgHjelp} />;
}

/**
 * Handler for "engasjerDeg" document type
 */
export async function handleEngasjerDegType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const [{ data: engasjerDeg }, { data: stillinger }] = await Promise.all([
    getDocumentBySlug(QueryType.EngasjerDeg, slug, language),
    sanityFetch({
      query: PAGINATED_ARTICLES_QUERY,
      params: {
        type: "job-position",
        start: 0,
        end: PAGINATION.MAX_JOB_POSITIONS,
        category: null,
      },
    }),
  ]);

  if (!engasjerDeg) {
    return <PMDDErrorMessage />;
  }

  const EngasjerDegPage = (
    await import("@/components/pages/engasjerDeg/EngasjerDegPage")
  ).default;

  return (
    <EngasjerDegPage document={engasjerDeg} stillinger={stillinger || []} />
  );
}

/**
 * Handler for "aktuelt" document type
 */
export async function handleAktueltType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const [{ data: aktuelt }, { data: aktiviteter }] = await Promise.all([
    getDocumentBySlug(QueryType.Aktuelt, slug, language),
    sanityFetch({ query: ALL_AKTIVITETER_QUERY, params: {} }),
  ]);

  if (!aktuelt) {
    return <PMDDErrorMessage />;
  }

  const AktueltPage = (await import("@/components/pages/aktuelt/AktueltPage"))
    .default;

  return <AktueltPage document={aktuelt} aktiviteter={aktiviteter || []} />;
}

/**
 * Handler for "nettbutikk" document type
 */
export async function handleNettbutikkType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const [{ data: nettbutikk }, products] = await Promise.all([
    getDocumentBySlug(QueryType.Nettbutikk, slug, language),
    getMerchProducts(),
  ]);

  if (!nettbutikk) {
    return <PMDDErrorMessage />;
  }

  const MerchPage = (await import("@/components/pages/merch/MerchPage"))
    .default;

  return (
    <MerchPage
      products={products}
      title={nettbutikk.title}
      richText={nettbutikk.richText}
      hubSlug={slug[slug.length - 1]}
    />
  );
}

/**
 * Handler for "legalDocument" document type
 */
export async function handleLegalDocumentType(
  slug: string[],
  language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const { data: legalDoc } = await getDocumentBySlug(
    QueryType.LegalDocument,
    slug,
    language,
  );

  if (!legalDoc) {
    return <PMDDErrorMessage />;
  }

  return <Legal document={legalDoc} slug={slug[slug.length - 1]} />;
}

/**
 * Handler for "merch" document type
 * The Sanity document's slug.current is used directly as the Shopify product handle.
 */
export async function handleMerchType(
  slug: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _language: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchParams?: SearchParams,
): Promise<ReactElement> {
  const handle = slug[slug.length - 1];
  const product = await getProductByHandle(handle);

  if (!product) {
    return <PMDDErrorMessage />;
  }

  return <ProductPage product={product} />;
}

/**
 * Content type handler registry
 * Maps document types to their handler functions
 */
export const contentTypeHandlers = {
  page: handlePageType,
  article: handleArticleType,
  event: handleEventType,
  availablePosition: handleAvailablePositionType,
  legalDocument: handleLegalDocumentType,
  merch: handleMerchType,
  minnehagen: handleMinnehagenType,
  stotteOgHjelp: handleStotteOgHjelpType,
  engasjerDeg: handleEngasjerDegType,
  aktuelt: handleAktueltType,
  nettbutikk: handleNettbutikkType,
} as const;

/**
 * Type for valid content types
 */
export type ContentType = keyof typeof contentTypeHandlers;
