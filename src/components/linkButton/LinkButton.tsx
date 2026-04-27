import React from "react";
import styles from "./linkButton.module.css";
import Link from "next/link";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
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
  const openInNewTab = link?.newTab;
  return (
    href && (
      <Link
        className={className}
        href={href}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        {link?.title}
      </Link>
    )
  );
};

export default LinkButton;
