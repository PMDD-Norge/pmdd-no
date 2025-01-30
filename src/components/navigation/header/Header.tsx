"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "./components/LanguageSelector";
import { PageLinks, PageCTAs } from "./components/links";
import { useTranslations } from "next-intl";
import {
  BrandAssets,
  Navigation,
  SanityLink,
} from "@/sanity/lib/interfaces/siteSettings";
import { Language } from "@/i18n/supportedLanguages";
import { linkID } from "@/sanity/schemaTypes/objects/link";
import { callToActionFieldID } from "@/sanity/schemaTypes/fields/callToActionFields";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import SanityNextImage from "@/components/image/sanityImage";

export interface HeaderProps {
  navigation: Navigation;
  assets: BrandAssets;
  currentLanguage: string;
  supportedLanguages: Language[];
}

const filterLinks = (data: SanityLink[], type: string) =>
  data?.filter((link) => link._type === type);

const sidebarID = "sidebar";

export const Header = ({
  navigation,
  assets,
  currentLanguage,
  supportedLanguages,
}: HeaderProps) => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const sidebarData = navigation?.sidebar || navigation?.main;
  const links = filterLinks(navigation?.main, linkID);
  const ctas = filterLinks(navigation?.main, callToActionFieldID);
  const sidebarLinks = filterLinks(sidebarData, linkID);
  const sidebarCtas = filterLinks(sidebarData, callToActionFieldID);

  const t = useTranslations();

  const mainMenuString = t(GlobalTranslationKey.mainMenu) || "Main menu";
  const homeString = t(GlobalTranslationKey.home) || "Home";
  const mobileMenuString = t(GlobalTranslationKey.mobileMenu) || "Mobile Menu";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMenuOpen, isLanguageMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className={`${styles.focusOn} ${isMenuOpen ? styles.isOpen : ""}`}
    >
      <header>
        <nav aria-label={mainMenuString}>
          <div className={styles.wrapper}>
            {assets?.primaryLogo && (
              <div className={styles.logo}>
                <Link href={`/${currentLanguage}`} aria-label={homeString}>
                  <SanityNextImage image={assets?.primaryLogo} />
                </Link>
              </div>
            )}
            <PageLinks links={links} pathname={pathname} />
            <div className={styles.buttonsWrapper}>
              <div className={styles.languageAndCtaWrapper}>
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  supportedLanguages={supportedLanguages}
                  toggleLanguageMenu={toggleLanguageMenu}
                  isLanguageMenuOpen={isLanguageMenuOpen}
                />
                <PageCTAs ctas={ctas} />
              </div>
              <button
                aria-haspopup="dialog"
                aria-controls={sidebarID}
                className={isMenuOpen ? styles.open : styles.closed}
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Toggle mobile menu</span>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div
              className={styles.mobileMenu}
              id={sidebarID}
              aria-label={mobileMenuString}
              role="dialog"
              aria-modal="true"
            >
              <PageLinks links={sidebarLinks} isMobile pathname={pathname} />
              <PageCTAs ctas={sidebarCtas} isMobile />
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};
