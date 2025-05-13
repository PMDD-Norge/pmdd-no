import styles from "./header.module.css";
import { BrandAssets, Navigation } from "@/sanity/lib/interfaces/siteSettings";
import { Language } from "@/i18n/supportedLanguages";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import Link from "next/link";
import SanityNextImage from "@/components/image/sanityImage";
import { PageCTAs, PageLinks } from "./components/links";
import { LanguageSelector } from "./components/LanguageSelector";
import { MobileMenuButton } from "./MobileMenuButton";
import MobileMenu from "./MobileMenuWrapper";

export interface HeaderProps {
  navigation: Navigation;
  assets: BrandAssets;
  currentLanguage: string;
  supportedLanguages: Language[];
}

const Header = async ({
  navigation,
  assets,
  currentLanguage,
  supportedLanguages,
}: HeaderProps) => {
  const { t } = await getCustomTranslations(currentLanguage);
  const mainMenuString = t(GlobalTranslationKey.mainMenu) || "Main menu";
  const homeString = t(GlobalTranslationKey.home) || "Home";
  const links = navigation?.main?.links;
  const ctas = navigation?.main?.ctas;

  return (
    <div className={styles.focusOn} id="headerWrapper">
      <header className={styles.sticky}>
        <nav aria-label={mainMenuString}>
          <div className={styles.wrapper}>
            {assets?.primaryLogo && (
              <div className={styles.logo}>
                <Link href={`/${currentLanguage}`} aria-label={homeString}>
                  <SanityNextImage image={assets?.primaryLogo} priority />
                </Link>
              </div>
            )}
            <PageLinks links={links} />
            <div className={styles.buttonsWrapper}>
              <div className={styles.languageAndCtaWrapper}>
                {supportedLanguages.length > 1 && (
                  <LanguageSelector
                    currentLanguage={currentLanguage}
                    supportedLanguages={supportedLanguages}
                  />
                )}
                <PageCTAs ctas={ctas} />
              </div>
              <MobileMenuButton />
            </div>
          </div>
          <MobileMenu sidebarLinks={links} sidebarCtas={ctas} />
        </nav>
      </header>
    </div>
  );
};

export default Header;
