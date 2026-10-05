import CustomLink from "./CustomLink";
import styles from "./linkList.module.css";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";

interface LinkListProps {
  links?: Array<SanityLink | undefined>;
}

/**
 * Rekke med lenker i lenkestil (tekst + pil). Rendrer ingenting uten lenker.
 */
const LinkList = ({ links }: LinkListProps) => {
  const filtered = (links ?? []).filter((l): l is SanityLink => Boolean(l));
  if (filtered.length === 0) return null;

  return (
    <div className={styles.linkList}>
      {filtered.map((link, i) => (
        <CustomLink key={link._key ?? i} link={link} />
      ))}
    </div>
  );
};

export default LinkList;
