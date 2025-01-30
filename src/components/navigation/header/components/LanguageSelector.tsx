import styles from "../header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Language } from "@/i18n/supportedLanguages";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { getTranslatedSlug } from "@/utils/getTranslatedSlug";
import { COOKIE_ONE_YR_EXPIRY } from "@/utils/cookies";

interface LanguageChangeOptions {
  preventMultipleClicks?: boolean;
}

const createLanguageRedirectUrl = (
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

const LanguageMenu = ({
  supportedLanguages,
  languageId,
}: {
  supportedLanguages: Language[];
  languageId: string;
}) => {
  const t = useTranslations();
  const [isChanging, setIsChanging] = useState(false);
  const pathname = usePathname();

  const languageSelectionMenuString =
    t(GlobalTranslationKey.languageSelectionMenu) || "Language selection menu";
  const changeLanguageToString = (language: string) =>
    `${t(GlobalTranslationKey.changeLanguageTo)} ${language}`;

  const handleLanguageChange = async (
    language: Language,
    options: LanguageChangeOptions = {}
  ): Promise<void> => {
    const { preventMultipleClicks = true } = options;

    // Prevent multiple simultaneous clicks
    if (preventMultipleClicks && isChanging) return;

    try {
      // Set changing state to prevent multiple interactions
      setIsChanging(true);

      // Get current search parameters
      const searchParams = new URLSearchParams(window.location.search);

      // Remove current language from path segments
      const pathSegments = pathname.split("/").filter(Boolean).slice(1);

      // Translate slugs
      const translatedSlugs = await getTranslatedSlug(
        pathSegments,
        languageId,
        language.id
      );

      // Create redirect URL
      const redirectUrl = createLanguageRedirectUrl(
        pathname,
        language.id,
        translatedSlugs,
        searchParams
      );

      // Set language cookie
      document.cookie = `lang=${language.id}; path=/; max-age=${COOKIE_ONE_YR_EXPIRY}`;

      // Navigate to translated path
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Language change failed:", error);
    } finally {
      // Reset changing state
      setIsChanging(false);
    }
  };

  return (
    <ul
      className={styles.languageMenu}
      role="menu"
      aria-label={languageSelectionMenuString}
    >
      {supportedLanguages.map((language) => {
        const isSelected = language.id === languageId;

        return (
          <li key={language._key} role="none">
            {isSelected ? (
              <p
                className={styles.selectedLanguage}
                role="menuitem"
                aria-current="true"
              >
                {language.title}
              </p>
            ) : (
              <Link
                href={`/${language.id}`}
                className={styles.languageButtonLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange(language);
                }}
                role="menuitem"
                aria-disabled={isChanging}
                aria-label={changeLanguageToString(language.title)}
              >
                {language.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const LanguageSelector = ({
  currentLanguage,
  supportedLanguages,
  toggleLanguageMenu,
  isLanguageMenuOpen,
}: {
  currentLanguage?: string;
  supportedLanguages: Language[];
  toggleLanguageMenu: () => void;
  isLanguageMenuOpen: boolean;
}) => {
  const t = useTranslations();

  // Early return if language selection is not applicable
  if (!currentLanguage || supportedLanguages.length <= 1) {
    return null;
  }

  const languageSelection =
    t(GlobalTranslationKey.languageSelection) || "Language selection";

  return (
    <div
      className={styles.languageSettings}
      role="region"
      aria-label={languageSelection}
    >
      <button
        type="button"
        className={styles.languageButton}
        onClick={toggleLanguageMenu}
        aria-haspopup="menu"
        aria-expanded={isLanguageMenuOpen}
        aria-controls="language-menu"
      >
        {
          supportedLanguages.find((language) => language.id === currentLanguage)
            ?.title
        }
      </button>
      {isLanguageMenuOpen && (
        <LanguageMenu
          supportedLanguages={supportedLanguages}
          languageId={currentLanguage}
        />
      )}
    </div>
  );
};
