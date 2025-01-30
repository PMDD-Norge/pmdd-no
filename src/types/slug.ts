export const SUPPORTED_DOC_TYPES = ["post", "page", "information"];

export type SlugTranslationResult = {
  translatedSlug?: string;
  _type?: string;
};

export type NestedSlugTranslationResult = {
  mainTranslatedSlug?: string;
  postTranslatedSlug?: {
    translatedSlug?: string;
  };
};
