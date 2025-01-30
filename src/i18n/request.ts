import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { client } from "@/sanity/lib/client";
import { GLOBAL_TRANSLATIONS_QUERY } from "@/sanity/lib/queries/globalTranslations";

export default getRequestConfig(async () => {
  const locale = (globalThis as any).locale as string;
  const validLocale = routing.locales.includes(locale)
    ? locale
    : routing.defaultLocale;

  try {
    const translations = await client.fetch(GLOBAL_TRANSLATIONS_QUERY, {
      language: validLocale,
    });

    // Normalize translation keys by removing special characters
    // Store translations directly at root level, without the Common namespace
    let messages = translations?.reduce(
      (acc: Record<string, string>, item: any) => {
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
