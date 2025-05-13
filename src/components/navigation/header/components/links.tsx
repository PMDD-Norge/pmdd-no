"use client";

import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import styles from "../header.module.css";
import { getHref } from "@/utils/getHref";
import CustomLink from "@/components/link/CustomLink";
import LinkButton from "@/components/linkButton/LinkButton";
import { usePathname } from "next/navigation";

export const PageLinks = ({
  links,
  isMobile = false,
}: {
  links: SanityLink[];
  isMobile?: boolean;
}) => {
  const pathname = usePathname();
  return (
    <ul className={isMobile ? styles.listMobile : styles.desktopLinks}>
      {links.map((link: SanityLink) => {
        const linkUrl = getHref(link);
        const isSelected = isPathActive(linkUrl, pathname);
        return (
          <li key={link._key}>
            <CustomLink link={link} type="headerLink" isSelected={isSelected} />
          </li>
        );
      })}
    </ul>
  );
};

export const PageCTAs = ({
  ctas,
  isMobile = false,
}: {
  ctas: SanityLink[];
  isMobile?: boolean;
}) => (
  <ul className={isMobile ? styles.listMobile : styles.desktopCtas}>
    {ctas.map((link: SanityLink, index) => (
      <li key={link._key}>
        <LinkButton
          link={link}
          type={ctas.length < 2 || index === 1 ? "primary" : "secondary"}
        />
      </li>
    ))}
  </ul>
);

// Helper function to normalize paths for comparison
const normalizePath = (path: string) => {
  // Remove leading and trailing slashes
  const cleanPath = path.replace(/^\/|\/$/g, "");
  // Remove language prefix if it exists (en, no, dk)
  const pathParts = cleanPath.split("/");
  if (pathParts[0]?.length === 2) {
    return pathParts.slice(1).join("/");
  }
  return cleanPath;
};

// Helper function to check if a path is part of the current pathname
const isPathActive = (linkPath: string, currentPath: string) => {
  const normalizedLink = normalizePath(linkPath);
  const normalizedCurrent = normalizePath(currentPath);

  // For exact matches (like /information matching /information)
  if (normalizedLink === normalizedCurrent) return true;

  // For information post pages (like /information matching /information/information-post-slug)
  if (normalizedCurrent.startsWith(normalizedLink + "/")) return true;

  return false;
};
