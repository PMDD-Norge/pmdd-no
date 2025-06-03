import { SanityLink, LinkType } from "@/sanity/lib/interfaces/siteSettings";
import styles from "./card.module.css";
import Link from "next/link";
import { getHref } from "@/utils/getHref";
import Text from "../text/Text";
import { isExternalLink } from "@/utils/linkUtils";

const Card = ({ link }: { link: SanityLink }) => {
  const { title, description, ariaLabel } = link;

  const href = getHref(link);
  const newTab = link.newTab;
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;
  
  // Check if this is an external link or explicitly marked to open in new tab
  const shouldShowExternalIcon = link.type === LinkType.External || isExternalLink(href) || newTab;

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={styles.card}
    >
      <div className={styles.title}>
        <Text type="h4">{title}</Text>
        {shouldShowExternalIcon && <div className={styles.externalLinkIcon} />}
      </div>
      <Text>{description}</Text>
    </Link>
  );
};

export default Card;
