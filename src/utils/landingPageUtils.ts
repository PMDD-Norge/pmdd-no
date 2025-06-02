import { sanityFetch } from "@/sanity/lib/live";
import { LANDING_PAGE_ID_QUERY } from "@/sanity/lib/queries/navigation";

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
    console.error("Error checking if page is landing page:", error);
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
    console.error("Error getting landing page ID:", error);
    return null;
  }
}