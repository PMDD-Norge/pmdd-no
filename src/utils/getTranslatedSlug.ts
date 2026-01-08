import { client } from "@/sanity/lib/client";
import {
  getNestedSlugQuery,
  getSingleSlugQuery,
} from "./sanityQueriesForMiddleware";
import {
  NestedSlugTranslationResult,
  SlugTranslationResult,
  SUPPORTED_DOC_TYPES,
} from "@/types/slug";
import { logger, logError } from './logger';

export async function getTranslatedSlug(
  pathSegments: string[],
  currentLang: string,
  newLang: string,
  options?: {
    supportedTypes?: string[];
    includeQueryParams?: boolean;
  }
): Promise<string[] | null> {
  if (!pathSegments.length || !currentLang || !newLang) {
    logger.warn("Invalid translation parameters", { pathSegments, currentLang, newLang });
    return null;
  }

  try {
    if (pathSegments.length === 1) {
      const result = await client.fetch<SlugTranslationResult>(
        getSingleSlugQuery,
        {
          types: options?.supportedTypes || SUPPORTED_DOC_TYPES,
          currentLang,
          currentSlug: pathSegments[0],
          newLang,
        }
      );

      return result?.translatedSlug ? [result.translatedSlug] : null;
    }

    const result = await client.fetch<NestedSlugTranslationResult>(
      getNestedSlugQuery,
      {
        types: options?.supportedTypes || SUPPORTED_DOC_TYPES,
        currentLang,
        mainSlug: pathSegments[0],
        postSlug: pathSegments[1],
        newLang,
      }
    );

    if (
      result?.mainTranslatedSlug &&
      result?.postTranslatedSlug?.translatedSlug
    ) {
      return [
        result.mainTranslatedSlug,
        result.postTranslatedSlug.translatedSlug,
      ];
    }

    return result?.mainTranslatedSlug
      ? [result.mainTranslatedSlug, pathSegments[1]]
      : null;
  } catch (error) {
    logError(error, {
      context: "Slug translation",
      pathSegments,
      currentLang,
      newLang,
    });
    return null;
  }
}
