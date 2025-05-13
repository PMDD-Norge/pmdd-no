export const createLanguageRedirectUrl = (
  basePath: string,
  languageId: string,
  translatedSlugs: string[] | null,
  currentSearchParams: URLSearchParams
): string => {
  // Construct base path with translated slugs or fallback
  const path = translatedSlugs
    ? `/${languageId}/${translatedSlugs.join("/")}`
    : `/${languageId}`;

  // Create URL with preserved query parameters
  const url = new URL(path, window.location.origin);
  currentSearchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.pathname + url.search;
};

import { useEffect } from "react";

export function useGlobalEventListener(
  isActive: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    if (!isActive) return;

    const handleGlobalEvents = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClose();
        }
      } else if (event instanceof KeyboardEvent && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleGlobalEvents);
    document.addEventListener("keydown", handleGlobalEvents);

    return () => {
      document.removeEventListener("mousedown", handleGlobalEvents);
      document.removeEventListener("keydown", handleGlobalEvents);
    };
  }, [isActive, ref, onClose]);
}
