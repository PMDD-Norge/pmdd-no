import { getTranslations } from "next-intl/server";

/**
 * Note: globalTranslations removed from Sanity (project is Norwegian only).
 * All translations are now managed through next-intl JSON files.
 */
export async function getCustomTranslations(language: string) {
  // Get next-intl translations
  const t = await getTranslations({
    locale: language,
  });

  return {
    t: (key: string, params?: Record<string, string | number>) => {
      return t(key, params);
    },
  };
}
