import Link from "next/link";
import styles from "./breadcrumbs.module.css";
import { BreadcrumbItem } from "@/utils/breadcrumbs";

interface BreadcrumbsProps {
  /** Mellomledd og siste ledd (siden man er på). «Hjem» legges til automatisk. */
  items: BreadcrumbItem[];
}

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Brødsmulesti for undersider, med strukturerte data (BreadcrumbList) for søkemotorer.
 */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const trail: BreadcrumbItem[] = [{ label: "Hjem", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && baseUrl ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Brødsmulesti" className={styles.nav}>
      <ol className={styles.list}>
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
};

export default Breadcrumbs;
