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
      // Get the slug from the expanded reference
      const slug = internalLink?.slug?.current;

      // Debug logging to help identify missing slugs
      if (!slug && internalLink) {
        console.warn(
          "Internal link is missing slug.current:",
          internalLink,
          "Link title:",
          link?.title
        );
      }

      if (slug) {
        const [path, query] = slug.split("?");

        // Build the URL path
        let link: string;
        if (path === "/") {
          // Root page - just add anchor if present
          link = `/${formatAnchor(anchor)}`;
        } else {
          // Regular page - add path, query params, and anchor
          link = `/${path}${query ? `?${query}` : ""}${formatAnchor(anchor)}`;
        }

        return link;
      }

      // If we reach here, the internal link is missing its slug
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
