import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";

const hash = "#";

export const getHref = (link: SanityLink): string => {
  if (!link) return hash;

  const { type, internalLink, anchor, url, email, phone } = link;

  // Helper function to ensure anchor has proper # prefix without duplication
  const formatAnchor = (anchor: string | undefined) => {
    if (!anchor) return "";
    return anchor.startsWith("#") ? anchor : `#${anchor}`;
  };

  switch (type) {
    case LinkType.Internal:
      if (internalLink?._ref) {
        const [path, query] = internalLink._ref.split("?");

        // Note: With new schema structure, articles (including job positions and blog posts)
        // are all type 'article' with different type field values
        const isArticle = internalLink._type === "article";

        let link: string;
        if (isArticle) {
          // Articles can be nested under different parent pages based on their type
          // This logic may need adjustment based on your routing structure
          link =
            path === "/"
              ? "/"
              : `/${path}${query ? `?${query}` : ""}${formatAnchor(anchor)}`;
        } else {
          link =
            path === "/"
              ? `/${formatAnchor(anchor)}`
              : `/${path}${query ? `?${query}` : ""}${formatAnchor(anchor)}`;
        }

        return link;
      }
      return hash;

    case LinkType.External:
      return url || hash;

    case LinkType.Email:
      return `mailto:${email}`;

    case LinkType.Phone:
      return `tel:${phone}`;

    default:
      return hash;
  }
};
