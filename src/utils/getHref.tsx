import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { availablePositionId } from "@/sanity/schemaTypes/documents/editorial/highlights/availablePosition";
import { postId } from "@/sanity/schemaTypes/documents/editorial/information/post";

const hash = "#";

export const getHref = (link: SanityLink): string => {
  if (!link) return hash;

  const { type, internalLink, anchor, url, email, phone } = link;

  switch (type) {
    case LinkType.Internal:
      if (internalLink?._ref) {
        const [path, query] = internalLink._ref.split("?");
        const isNestedPage =
          internalLink._type === availablePositionId ||
          internalLink._type === postId;

        let link: string;
        if (isNestedPage) {
          const parentPage =
            internalLink._type === availablePositionId
              ? "aktuelt"
              : internalLink._type === postId
                ? "informasjon"
                : null;
          link =
            path === "/"
              ? "/"
              : `/${parentPage}/${path}${parentPage == "aktuelt" ? "?type=position" : query ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`;
        } else {
          link =
            path === "/"
              ? "/"
              : `/${path}${query ? `?${query}` : ""}${anchor ? `${anchor}` : ""}`;
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
