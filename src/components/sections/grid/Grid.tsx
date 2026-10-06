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
  AktivitetDocument,
  AktivitetMedSlug,
  AvailablePositionDocument,
  EventDocument,
  GridItem,
  GridList,
  GridObject,
  TurVennDocument,
  WalkingTourDocument,
} from "@/sanity/lib/interfaces/pages";
import LinkButton from "@/components/linkButton/LinkButton";
import AktivitetKort from "@/components/aktivitet/AktivitetKort";
import { medAktivitetSlugs } from "@/utils/aktivitetSlug";
import { kommendeAktiviteter } from "@/utils/aktivitetUtils";

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
  const { appearance, title, tittelNivaa, richText, lists, _key } = props.grid;
  const theme = getThemeClassFromAppearance(appearance);

  return (
    <article className={theme} id={_key}>
      <div className={`sectionWrapperColumn ${styles.grid}`}>
        {title && <Text type={tittelNivaa ?? "h2"}>{getDisplayText(title)}</Text>}
        {richText && <RichText value={richText} />}
        {lists?.map((list, i) => (
          <GridListSection key={list._key || i} list={list} />
        ))}
      </div>
    </article>
  );
};

const GridListSection = async ({ list }: { list: GridList }) => {
  // Aktiviteter vises som på /aktuelt: bare kommende, sortert på dato, med
  // samme kort og lenke til aktivitetens side
  const erAktivitetsliste = list.contentType?.startsWith("aktivitet") ?? false;
  const items = erAktivitetsliste
    ? await medAktivitetSlugs(
        kommendeAktiviteter((list.items || []) as unknown as AktivitetDocument[]),
      )
    : list.items;

  // For manual grids, show all items. For other types, apply maxItems limit (0 = show all)
  const shouldApplyLimit = list.contentType !== "manual" && !!list.maxItems;
  const displayItems = (
    shouldApplyLimit ? items?.slice(0, list.maxItems) || [] : items || []
  ) as GridElementItem[];
  const itemCount = displayItems.length;
  const columns = list.columns ?? 3;
  const kolonnerMobil = list.kolonnerMobil ?? 2;

  return (
    <section className={styles.listSection}>
      {list.title && <Text type="h3">{getDisplayText(list.title)}</Text>}
      <ul
        className={`${styles.list} ${getGridClassForItemCount(itemCount)}`}
        style={{ "--columns": columns, "--columns-mobile": kolonnerMobil } as React.CSSProperties}
      >
        {displayItems.map((item) => (
          <GridElement
            key={("_key" in item && item._key) || item._id}
            item={item}
          />
        ))}
      </ul>
      {list.bunnTekst && list.bunnTekst.length > 0 && (
        <RichText value={list.bunnTekst} />
      )}
      {list.ctaLink?.title && (
        <div className={styles.ctaLink}>
          <LinkButton
            link={list.ctaLink}
            type="secondary"
          />
        </div>
      )}
    </section>
  );
};

type GridElementItem =
  | EventDocument
  | AvailablePositionDocument
  | GridItem
  | WalkingTourDocument
  | TurVennDocument
  | AktivitetDocument;

// Helper function to determine the correct route path based on document type
// Documents should route through their hub pages
const getRouteForType = (item: GridElementItem): string => {
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
  if (
    (documentType === "article" || documentType === "informasjonsartikkel") &&
    "type" in item
  ) {
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
const createInternalLink = (item: GridElementItem): SanityLink | undefined => {
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

const GridElement = ({ item }: { item: GridElementItem }) => {
  const itemAny = item as unknown as Record<string, unknown>;

  if ("_type" in item && item._type === "aktivitet" && "slug" in itemAny) {
    return (
      <li className={styles.listItem}>
        <AktivitetKort aktivitet={item as unknown as AktivitetMedSlug} />
      </li>
    );
  }

  // Check document type
  const isEvent = "_type" in item && item._type === "event";
  const isFrivillig = "_type" in item && item._type === "frivillig";
  const isWalkingTour = "_type" in item && item._type === "walkingTour";
  const isTurVenn = "_type" in item && item._type === "turvenn";

  // Get title - frivillige and turvenn use 'name' field
  const itemTitle: string | undefined =
    (isFrivillig || isTurVenn) && "name" in item
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
  const walkingTourTurvenn = isWalkingTour
    ? (item as WalkingTourDocument).turvenn
    : undefined;
  const turvennName: string | null =
    walkingTourTurvenn?.name ?? null;

  const image = "image" in item && item.image ? item.image : undefined;

  return (
    <li className={styles.listItem}>
      {image?.asset && (image.asset._ref || image.asset._id) && (
        <div className={styles.image}>
          <SanityNextImage image={image} />
        </div>
      )}
      {itemTitle && <Text type="h4">{getDisplayText(itemTitle)}</Text>}

      {/* By vises for turvenner (frivillige med city satt, og gammel "turvenn"-type) */}
      {(isTurVenn || isFrivillig) && "city" in item && !!item.city && (
        <Text type="small">{item.city as string}</Text>
      )}

      {/* Event-specific fields: date and location */}
      {isEvent && "startDate" in item && !!item.startDate && (
        <Text type="small" className={styles.eventDate}>
          {new Date(item.startDate as string).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Europe/Oslo",
          })}
          {"endDate" in item &&
            !!item.endDate &&
            ` - ${new Date(item.endDate as string).toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Europe/Oslo",
            })}`}
        </Text>
      )}
      {isEvent && "location" in item && !!item.location && (
        <Text type="small" className={styles.eventLocation}>
          {item.location as string}
        </Text>
      )}

      {/* Walking tour-specific fields */}
      {isWalkingTour && "dateTime" in item && !!item.dateTime && (
        <Text type="small" className={styles.eventDate}>
          {new Date(item.dateTime as string).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Oslo",
          })}
        </Text>
      )}
      {isWalkingTour && "location" in item && !!item.location && (
        <Text type="small" className={styles.eventLocation}>
          {item.location as string}
        </Text>
      )}
      {turvennName !== null && (
        <Text type="small">Turvenn: {turvennName}</Text>
      )}

      {content && typeof content === "string" && (
        <Text type="small">{content}</Text>
      )}
      {content && Array.isArray(content) && content.length > 0 && (
        <PortableText value={content} components={myPortableTextComponents} />
      )}
      {isFrivillig && "bio" in item && !!item.bio && (
        <Text type="small">{item.bio as string}</Text>
      )}
      {isFrivillig && "email" in item && !!item.email && (
        <Text type="small">
          <a href={`mailto:${item.email as string}`}>{item.email as string}</a>
        </Text>
      )}
      {facebookLink && (
        <div>
          <CustomLink link={facebookLink} />
        </div>
      )}
      {!facebookLink && link?.title && (
        <div>
          <CustomLink link={link} />
        </div>
      )}
    </li>
  );
};

export default Grid;
