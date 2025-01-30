import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { client } from "@/sanity/lib/client";
import { GLOBAL_TRANSLATIONS_QUERY } from "@/sanity/lib/queries/globalTranslations";

interface TranslationItem {
  labelKey: string;
  value: string;
  _type?: string;
  _key?: string;
}

export default getRequestConfig(async ({ locale: requestLocale }) => {
  const validLocale = routing.locales.includes(requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  try {
    const translations = await client.fetch(GLOBAL_TRANSLATIONS_QUERY, {
      language: validLocale,
    });

    let messages = translations?.reduce(
      (acc: Record<string, string>, item: TranslationItem) => {
        const normalizedKey = item.labelKey.replace(
          /[\s\u200B-\u200D\uFEFF\u0000-\u001F]/g,
          ""
        );
        if (normalizedKey && item.value) {
          acc[normalizedKey] = item.value;
        }
        return acc;
      },
      {}
    );

    // Ensure default values exist
    if (!messages || Object.keys(messages).length === 0) {
      messages = {
        "skip-to-main": "Skip to main content",
        // Add other default translations
      };
    }

    return {
      messages,
      locale: validLocale,
      defaultTranslationValues: {
        locale: validLocale,
      },
    };
  } catch (error) {
    console.error("Translation fetch error:", error);
    // Return default translations on error
    return {
      messages: {
        Common: {
          "skip-to-main": "Skip to main content",
          // Add other default translations
        },
      },
      locale: validLocale,
    };
  }
});
