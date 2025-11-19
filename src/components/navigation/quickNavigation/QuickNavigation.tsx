import Link from "next/link";
import styles from "./quickNavigation.module.css";
import { PortableTextBlock } from "next-sanity";
import {
  extractH2TextsFromPortableText,
  generateHashFromHeading,
} from "@/utils/textUtils";
import Text from "@/components/text/Text";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import CustomLink from "@/components/link/CustomLink";

const QuickNavigation = async ({
  richText,
  isMainLayout = true,
  currentSlug,
}: {
  richText: PortableTextBlock[];
  isMainLayout?: boolean;
  currentSlug: string;
}) => {
  const quickNavigationString = "Hurtignavigasjon";

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
        {headings?.map((heading, index) => {
          const hash = generateHashFromHeading(heading);
          return (
            <li key={hash}>
              {isMainLayout ? (
                <CustomLink
                  link={{
                    _key: `heading-${index}`,
                    _type: "link",
                    title: heading,
                    type: LinkType.Internal,
                    internalLink: {
                      _ref: currentSlug,
                    },
                    anchor: hash,
                  }}
                />
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
