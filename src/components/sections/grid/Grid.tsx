import styles from "./grid.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";
import {
  PortableText,
  PortableTextReactComponents,
  PortableTextBlock,
} from "@portabletext/react";
import { getDisplayText } from "@/utils/textUtils";
import { getThemeClassFromAppearance } from "@/utils/themeUtils";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";

import {
  AvailablePositionDocument,
  EventDocument,
  GridItem,
  GridList,
  GridObject,
} from "@/sanity/lib/interfaces/pages";

// Interface for articles with type field
interface ArticleWithType {
  _type: string;
  type?: string;
  slug: {
    current: string;
  };
}

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="small">{children}</Text>,
};

const getGridClassForItemCount = (count: number) => {
  if (count === 1) return styles.oneItem;
  if (count === 2) return styles.twoItems;
  return "";
};

type Props = {
  grid: GridObject;
};

export const Grid = async (props: Props) => {
  const { appearance, title, richText, lists, _key } = props.grid;
  const theme = getThemeClassFromAppearance(appearance);

  return (
    <article className={theme} id={_key}>
      <div className="sectionWrapperColumn">
        <Text type="h2">{getDisplayText(title)}</Text>
        {richText && <RichText value={richText} />}
        {lists?.map((list, i) => (
          <GridListSection key={list._key || i} list={list} />
        ))}
      </div>
    </article>
  );
};

const GridListSection = ({ list }: { list: GridList }) => {
  // For manual grids, show all items. For other types, apply maxItems limit
  const shouldApplyLimit = list.contentType !== "manual";
  const maxItems = shouldApplyLimit ? list.maxItems || 6 : undefined;
  const displayItems = maxItems
    ? list.items?.slice(0, maxItems) || []
    : list.items || [];
  const itemCount = displayItems.length;

  return (
    <section className={styles.listSection}>
      <Text type="h3">{getDisplayText(list.title)}</Text>
      <ul className={`${styles.list} ${getGridClassForItemCount(itemCount)}`}>
        {displayItems.map((item) => (
          <GridElement key={item._key || item._id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// Helper function to determine the correct route path based on document type
// Documents should route through their hub pages
const getRouteForType = (
  item: EventDocument | AvailablePositionDocument | GridItem
): string => {
  // Safety check: ensure item is an object
  if (!item || typeof item !== "object") {
    return "";
  }

  // Check if item has slug
  if (!("slug" in item) || !item.slug || typeof item.slug !== "object") {
    return "";
  }

  const slug = item.slug.current;
  const documentType = "_type" in item ? item._type : "";

  // Handle articles - they have a sub-type that determines their hub
  if (documentType === "article" && "type" in item) {
    const articleItem = item as ArticleWithType;
    const articleType = articleItem.type;

    switch (articleType) {
      case "blog-post":
        // Blog articles belong to "informasjon" hub
        return `informasjon/${slug}`;
      case "news":
        // News articles might belong to "aktuelt" hub
        return slug; // Update this if news has a hub
      case "job-position":
        // Job positions belong to "verv" hub
        return `verv/${slug}`;
      default:
        return slug;
    }
  }

  // Different document types belong to different hub pages
  switch (documentType) {
    case "event":
      // Events don't have a specific hub prefix in this setup
      return slug;
    case "article":
      // Generic articles route directly
      return slug;
    case "post":
      // Posts belong to the "informasjon" hub
      return `informasjon/${slug}`;
    case "availablePosition":
      // Available positions belong to the "verv" hub
      return `verv/${slug}`;
    default:
      return slug;
  }
};

// Helper function to create internal link for auto-populated items
const createInternalLink = (
  item: EventDocument | AvailablePositionDocument | GridItem
): SanityLink | undefined => {
  // If item already has a link, use it (works for GridItem, EventDocument, etc.)
  if ("link" in item && item.link) {
    return item.link;
  }

  // For auto-populated items with slug, create a link with correct routing
  if (
    "slug" in item &&
    item.slug &&
    "_type" in item &&
    "_id" in item &&
    item._id
  ) {
    const routePath = getRouteForType(item);

    return {
      _key: item.slug.current,
      _type: "link",
      title: "Les mer",
      type: LinkType.Internal,
      internalLink: {
        _ref: item._id,
        _type: item._type,
        slug: {
          current: routePath,
        },
      },
    };
  }

  return undefined;
};

const GridElement = ({
  item,
}: {
  item: EventDocument | AvailablePositionDocument | GridItem;
}) => {
  // Check document type
  const isEvent = "_type" in item && item._type === "event";
  const isWriter = "_type" in item && item._type === "writer";

  // Get title - writers use 'name' field
  const itemTitle = isWriter && "name" in item ? item.name : item.title;

  // Determine content based on available fields
  let content: string | PortableTextBlock[] | null | undefined = null;
  if ("lead" in item && item.lead) {
    // Use lead for items that have it (posts, articles, positions)
    content = item.lead;
  } else if ("occupation" in item && item.occupation) {
    // Use occupation for writers (team members)
    content = item.occupation;
  } else if ("richText" in item && item.richText) {
    // Use richText if available
    content = item.richText;
  } else if ("body" in item && item.body) {
    // Use body for events
    content = item.body;
  }

  const link = createInternalLink(item);

  return (
    <li className={styles.listItem}>
      {"image" in item && item.image?.asset?._ref && (
        <div className={styles.image}>
          <SanityNextImage image={item.image} />
        </div>
      )}
      {itemTitle && <Text type="h4">{getDisplayText(itemTitle)}</Text>}

      {/* Event-specific fields: date and location */}
      {isEvent && "startDate" in item && item.startDate && (
        <Text type="small" className={styles.eventDate}>
          {new Date(item.startDate).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {"endDate" in item && item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        </Text>
      )}
      {isEvent && "location" in item && item.location && (
        <Text type="small" className={styles.eventLocation}>
          📍 {item.location}
        </Text>
      )}

      {content && typeof content === "string" && (
        <Text type="small">{content}</Text>
      )}
      {content && Array.isArray(content) && content.length > 0 && (
        <PortableText value={content} components={myPortableTextComponents} />
      )}
      {link && (
        <div>
          <CustomLink link={link} />
        </div>
      )}
    </li>
  );
};

export default Grid;
