import React from "react";
import styles from "./link.module.css";
import Link from "next/link";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { getHref } from "@/utils/getHref";
type Componenttype = "link" | "headerLink" | "footerLink";

interface CustomLinkProps {
  type?: Componenttype;
  link: SanityLink;
  isSelected?: boolean;
}

const CustomLink = ({ type = "link", link, isSelected }: CustomLinkProps) => {
  const title = link.title;
  const href = getHref(link);
  const newTab = link.newTab;
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;
  const className =
    type === "headerLink"
      ? `${styles.headerLink} ${isSelected ? styles.selected : ""}`
      : styles.footerLink;

  return type === "link" ? (
    <div className={styles.wrapper}>
      <Link
        className={styles.link}
        href={href}
        target={target}
        rel={rel}
        aria-label={link.ariaLabel}
      >
        <span className={styles.span}>{title}</span>
      </Link>
      <div className={styles.underline}></div>
    </div>
  ) : (
    <Link
      className={className}
      href={href}
      target={target}
      rel={rel}
      aria-label={link.ariaLabel}
    >
      {title}
    </Link>
  );
};

export default CustomLink;
