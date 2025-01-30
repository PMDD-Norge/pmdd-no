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

export default getRequestConfig(async ({ requestLocale }) => {
  // Get and validate the locale
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  try {
    const translations = await client.fetch(GLOBAL_TRANSLATIONS_QUERY, {
      language: locale,
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
      };
    }

    return {
      messages,
      locale,
      defaultTranslationValues: {
        locale,
      },
    };
  } catch (error) {
    console.error("Translation fetch error:", error);
    return {
      messages: {
        Common: {
          "skip-to-main": "Skip to main content",
        },
      },
      locale,
    };
  }
});
