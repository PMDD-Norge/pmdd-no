import React from "react";
import styles from "./linkButton.module.css";
import Link from "next/link";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { getHref } from "@/utils/getHref";

type LinkButtonType = "primary" | "secondary";

interface IButton {
  isLoadMore?: boolean;
  type?: LinkButtonType;
  link: SanityLink;
}

const typeClassMap: { [key in LinkButtonType]: string } = {
  primary: styles.primary,
  secondary: styles.secondary,
};

const LinkButton = ({ isLoadMore, type = "primary", link }: IButton) => {
  const className = `${styles.button} ${isLoadMore ? styles.isLoadMore : ""} ${typeClassMap[type]}`;
  const href = getHref(link);
  const isExternal = link.type === LinkType.External;
  return (
    href && (
      <Link
        className={className}
        href={href}
        target={isExternal ? "_blank" : "_self"} // Open external links in a new tab
        rel={isExternal ? "noopener noreferrer" : undefined} // For security reasons when opening external links in a new tab
      >
        {link.title}
      </Link>
    )
  );
};

export default LinkButton;
