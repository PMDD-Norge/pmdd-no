import { sanityFetch } from "@/sanity/lib/live";
import { LANDING_PAGE_ID_QUERY } from "@/sanity/lib/queries";
import { logError } from './logger';

/**
 * Checks if a given page ID matches the landing page ID from navigationManager
 */
export async function isLandingPage(pageId?: string): Promise<boolean> {
  if (!pageId) {
    return false;
  }

  try {
    const { data: landingPageId } = await sanityFetch({
      query: LANDING_PAGE_ID_QUERY,
    });

    return pageId === landingPageId;
  } catch (error) {
    logError(error, { context: "Checking if page is landing page", pageId });
    return false;
  }
}

/**
 * Gets the landing page ID from navigationManager
 */
export async function getLandingPageId(): Promise<string | null> {
  try {
    const { data: landingPageId } = await sanityFetch({
      query: LANDING_PAGE_ID_QUERY,
    });

    return landingPageId || null;
  } catch (error) {
    logError(error, { context: "Getting landing page ID" });
    return null;
  }
}