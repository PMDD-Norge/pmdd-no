import { client } from "@/sanity/lib/client";
import { GLOBAL_TRANSLATIONS_QUERY } from "@/sanity/lib/queries/globalTranslations";
import { getTranslations } from "next-intl/server";

export async function getCustomTranslations(language: string) {
  // Fetch translations from Sanity
  const sanityResult = await client.fetch(GLOBAL_TRANSLATIONS_QUERY, {
    language,
  });

  // Initialize sanityTranslations as an empty array if the fetch returns null
  const sanityTranslations = sanityResult?.data || [];

  // Get next-intl translations
  const t = await getTranslations({
    locale: language,
  });

  return {
    t: (key: string, params?: Record<string, string | number>) => {
      // Check for Sanity translations first
      const sanityTranslation = sanityTranslations.find(
        (trans: { labelKey: string; value: string }) => trans.labelKey === key
      );

      if (sanityTranslation?.value) {
        // Handle parameter replacement in Sanity translations
        let value = sanityTranslation.value;
        if (params) {
          Object.entries(params).forEach(([key, val]) => {
            value = value.replace(`{${key}}`, String(val));
          });
        }
        return value;
      }

      // Fallback to next-intl translations
      return t(key, params);
    },
  };
}
