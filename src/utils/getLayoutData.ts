import { sanityFetch } from "@/sanity/lib/live";
import { BRAND_ASSETS_QUERY } from "@/sanity/lib/queries/brandAssets";
import { SUPPORTED_LANGUAGES_QUERY } from "@/sanity/lib/queries/i18n";
import { NAV_QUERY } from "@/sanity/lib/queries/navigation";
import { SOMEPROFILES_QUERY } from "@/sanity/lib/queries/socialMediaProfiles";

export async function getLayoutData(language: string) {
  return Promise.all([
    sanityFetch({ query: NAV_QUERY, params: { language } }),
    sanityFetch({ query: BRAND_ASSETS_QUERY, params: {} }),
    sanityFetch({ query: SOMEPROFILES_QUERY, params: {} }),
    sanityFetch({ query: SUPPORTED_LANGUAGES_QUERY, params: {} }),
  ]);
}
