import styles from "./header.module.css";
import { BrandAssets, Navigation } from "@/sanity/lib/interfaces/siteSettings";
import Link from "next/link";
import SanityNextImage from "@/components/image/sanityImage";
import { PageCTAs, PageLinks } from "./components/links";
import { MobileMenuButton } from "./MobileMenuButton";
import MobileMenu from "./MobileMenuWrapper";

export interface HeaderProps {
  navigation: Navigation | undefined;
  assets: BrandAssets | undefined;
}

const Header = ({ navigation, assets }: HeaderProps) => {
  const links = navigation?.main?.links;
  const ctas = navigation?.main?.callToActionField;
  const sidebarLinks = navigation?.sidebar?.links;
  const sidebarCtas = navigation?.sidebar?.callToActionField;

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Header - navigation.main:', navigation?.main);
    console.log('Header - CTAs:', ctas);
  }

  return (
    <div className={styles.focusOn} id="headerWrapper">
      <header className={styles.sticky}>
        <nav aria-label="Hovedmeny">
          <div className={styles.wrapper}>
            {assets?.primaryLogo && (
              <div className={styles.logo}>
                <Link href="/" aria-label="Hjem">
                  <SanityNextImage image={assets?.primaryLogo} priority />
                </Link>
              </div>
            )}
            <PageLinks links={links} />
            <div className={styles.buttonsWrapper}>
              <div className={styles.languageAndCtaWrapper}>
                <PageCTAs ctas={ctas} />
              </div>
              <MobileMenuButton />
            </div>
          </div>
          <MobileMenu sidebarLinks={sidebarLinks} sidebarCtas={sidebarCtas} />
        </nav>
      </header>
    </div>
  );
};

export default Header;
