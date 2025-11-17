/**
 * Note: globalTranslations removed from Sanity (project is Norwegian only).
 * All translations are now hardcoded in Norwegian.
 */
export async function getCustomTranslations() {
  // Simple translation function with hardcoded Norwegian strings
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      // Return Norwegian translations (can be expanded as needed)
      const translations: Record<string, string> = {
        "skip-to-main": "Hopp til hovedinnhold",
        home: "Hjem",
        "main-menu": "Hovedmeny",
        // Add more translations as needed
      };

      return translations[key] || key;
    },
  };
}
