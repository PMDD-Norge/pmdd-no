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
  TurVennDocument,
  WalkingTourDocument,
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
  // For manual grids, show all items. For other types, apply maxItems limit (0 = show all)
  const shouldApplyLimit = list.contentType !== "manual" && !!list.maxItems;
  const displayItems = shouldApplyLimit
    ? list.items?.slice(0, list.maxItems) || []
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
      {list.ctaLink && (
        <div className={styles.ctaLink}>
          <CustomLink type="buttonLink" link={list.ctaLink} />
        </div>
      )}
    </section>
  );
};

// Helper function to determine the correct route path based on document type
// Documents should route through their hub pages
const getRouteForType = (
  item:
    | EventDocument
    | AvailablePositionDocument
    | GridItem
    | WalkingTourDocument
    | TurVennDocument,
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
      return slug;
    case "article":
      return slug;
    case "post":
      return `informasjon/${slug}`;
    case "availablePosition":
      return `verv/${slug}`;
    case "walkingTour":
    case "turvenn":
      return slug;
    default:
      return slug;
  }
};

// Helper function to create internal link for auto-populated items
const createInternalLink = (
  item:
    | EventDocument
    | AvailablePositionDocument
    | GridItem
    | WalkingTourDocument
    | TurVennDocument,
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
  item:
    | EventDocument
    | AvailablePositionDocument
    | GridItem
    | WalkingTourDocument
    | TurVennDocument;
}) => {
  const itemAny = item as unknown as Record<string, unknown>;

  // Check document type
  const isEvent = "_type" in item && item._type === "event";
  const isWriter = "_type" in item && item._type === "writer";
  const isWalkingTour = "_type" in item && item._type === "walkingTour";
  const isTurVenn = "_type" in item && item._type === "turvenn";

  // Get title - writers and turvenn use 'name' field
  const itemTitle: string | undefined =
    (isWriter || isTurVenn) && "name" in item
      ? (item.name as string)
      : (item as { title?: string }).title;

  // Determine content based on available fields
  let content: string | PortableTextBlock[] | null | undefined = null;
  if (isWalkingTour && "description" in item && item.description) {
    content = item.description as string;
  } else if ("lead" in item && item.lead) {
    content = item.lead;
  } else if (
    "excerpt" in itemAny &&
    itemAny.excerpt &&
    typeof itemAny.excerpt === "string"
  ) {
    content = itemAny.excerpt as string;
  } else if (
    "occupation" in item &&
    item.occupation &&
    typeof item.occupation === "string"
  ) {
    content = item.occupation as string;
  } else if ("richText" in item && item.richText) {
    content = item.richText;
  } else if ("body" in item && item.body) {
    content = item.body;
  }

  const link = createInternalLink(item);

  // Build Facebook link for walking tours
  const facebookLink: SanityLink | undefined =
    isWalkingTour && "facebookUrl" in item && item.facebookUrl
      ? {
          _key: "facebook",
          _type: "link",
          title: "Facebook-arrangement",
          type: LinkType.External,
          url: item.facebookUrl as string,
          newTab: true,
        }
      : undefined;

  // Walking tour turvenn info
  const walkingTourTurvenn =
    isWalkingTour && "turvenn" in item && item.turvenn
      ? (item.turvenn as WalkingTourDocument["turvenn"])
      : undefined;

  const image = "image" in item && item.image ? item.image : undefined;

  return (
    <li className={styles.listItem}>
      {image?.asset && (image.asset._ref || image.asset._id) && (
        <div className={styles.image}>
          <SanityNextImage image={image} />
        </div>
      )}
      {itemTitle && <Text type="h4">{getDisplayText(itemTitle)}</Text>}

      {/* City for turvenn */}
      {isTurVenn && "city" in item && item.city && (
        <Text type="small">{item.city as string}</Text>
      )}

      {/* Event-specific fields: date and location */}
      {isEvent && "startDate" in item && item.startDate && (
        <Text type="small" className={styles.eventDate}>
          {new Date(item.startDate).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {"endDate" in item &&
            item.endDate &&
            ` - ${new Date(item.endDate).toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}
        </Text>
      )}
      {isEvent && "location" in item && item.location && (
        <Text type="small" className={styles.eventLocation}>
          {item.location as string}
        </Text>
      )}

      {/* Walking tour-specific fields */}
      {isWalkingTour && "dateTime" in item && item.dateTime && (
        <Text type="small" className={styles.eventDate}>
          {new Date(item.dateTime as string).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      )}
      {isWalkingTour && "location" in item && item.location && (
        <Text type="small" className={styles.eventLocation}>
          {item.location as string}
        </Text>
      )}
      {isWalkingTour && walkingTourTurvenn?.name && (
        <Text type="small">Turvenn: {walkingTourTurvenn.name}</Text>
      )}

      {content && typeof content === "string" && (
        <Text type="small">{content}</Text>
      )}
      {content && Array.isArray(content) && content.length > 0 && (
        <PortableText value={content} components={myPortableTextComponents} />
      )}
      {facebookLink && (
        <div>
          <CustomLink link={facebookLink} />
        </div>
      )}
      {!facebookLink && link && (
        <div>
          <CustomLink link={link} />
        </div>
      )}
    </li>
  );
};

export default Grid;
