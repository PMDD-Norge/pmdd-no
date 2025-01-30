import Link from "next/link";
import styles from "./quickNavigation.module.css";
import { PortableTextBlock } from "sanity";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import {
  extractH2TextsFromPortableText,
  generateHashFromHeading,
} from "@/utils/textUtils";
import Text from "@/components/text/Text";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import CustomLink from "@/components/link/CustomLink";

const QuickNavigation = async ({
  richText,
  language,
  isMainLayout = true,
}: {
  richText: PortableTextBlock[];
  language: string;
  isMainLayout?: boolean;
}) => {
  const { t } = await getCustomTranslations(language);
  const quickNavigationString =
    t(GlobalTranslationKey.quickNavigation) || "Quick Navigation";

  const headings = extractH2TextsFromPortableText(richText);
  const quickNav = "quick-nav";

  if (headings.length == 0) {
    return null;
  }

  return (
    <nav
      className={`${isMainLayout ? styles.mainLayout : ""} ${styles.quickNav}`}
    >
      <Text type="h3" id={quickNav}>
        {quickNavigationString}
      </Text>
      <ul className={styles.anchorLinks} aria-labelledby={quickNav}>
        {headings.map((heading, index) => {
          const hash = generateHashFromHeading(heading);
          const link = {
            _key: `heading-${index}`,
            _type: "link",
            title: heading,
            type: LinkType.Internal,
            internalLink: {
              _ref: `#${hash}`,
            },
          };
          return (
            <li key={hash}>
              {isMainLayout ? (
                <CustomLink link={link} />
              ) : (
                <Link href={`#${hash}`} className={styles.link}>
                  {heading}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default QuickNavigation;
