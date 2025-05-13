"use client";

import styles from "./languageSelector.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Language } from "@/i18n/supportedLanguages";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { getTranslatedSlug } from "@/utils/getTranslatedSlug";
import { COOKIE_ONE_YR_EXPIRY } from "@/utils/cookies";
import { createLanguageRedirectUrl } from "../utils/languageSettingsUtils";

interface LanguageChangeOptions {
  preventMultipleClicks?: boolean;
}

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
}: {
  currentLanguage: string;
  supportedLanguages: Language[];
}) => {
  const t = useTranslations();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageSelection =
    t(GlobalTranslationKey.languageSelection) || "Language selection";

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isLanguageMenuOpen) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isLanguageMenuOpen]);

  return (
    <div
      className={styles.languageSettings}
      ref={menuRef}
      role="region"
      aria-label={languageSelection}
    >
      <button
        type="button"
        className={styles.languageButton}
        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
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
