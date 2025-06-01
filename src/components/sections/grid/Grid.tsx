import styles from "./grid.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { truncateText, getDisplayText } from "@/utils/textUtils";
import { getCustomTranslations } from "@/utils/translations";
import { CONTENT_TYPES } from "@/utils/constants/contentTypes";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";

import {
  AvailablePositionDocument,
  EventDocument,
  GridItem,
  GridList,
  GridObject,
} from "@/sanity/lib/interfaces/pages";
import { PortableTextBlock } from "sanity";

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="small">{children}</Text>,
};


const getGridClassForItemCount = (count: number) => {
  if (count === 1) return styles.oneItem;
  if (count === 2) return styles.twoItems;
  return "";
};

type Props =
  | {
      mode: "simple";
      title: string;
      richText?: PortableTextBlock[];
      items: (EventDocument | AvailablePositionDocument)[];
      slug: string;
      language: string;
    }
  | {
      mode: "full";
      grid: GridObject;
      language?: string;
    };

export const Grid = async (props: Props) => {
  if (props.mode === "simple") {
    const { t } = await getCustomTranslations(props.language);
    const itemCount = props.items?.length || 0;

    return (
      <article className="darkBackground">
        <div className="sectionWrapperColumn">
          <div className={styles.textWrapper}>
            <Text type="h2">{getDisplayText(props.title)}</Text>
            {props.richText && <RichText value={props.richText} />}
          </div>
          <ul
            className={`${styles.list} ${getGridClassForItemCount(itemCount)}`}
          >
            {props.items.map((item, index) => (
              <GridElement
                key={`${item._key || item._id}-${index}`}
                item={item}
                slug={props.slug}
                t={t}
              />
            ))}
          </ul>
        </div>
      </article>
    );
  }

  const { appearance, title, richText, lists, _key } = props.grid;
  const theme =
    appearance?.theme === "dark" ? "darkBackground" : "lightBackground";

  // Get translations if language is provided
  const t = props.language ? (await getCustomTranslations(props.language)).t : undefined;

  return (
    <article className={theme} id={_key}>
      <div className="sectionWrapperColumn">
        <div className={styles.textWrapper}>
          <Text type="h2">{getDisplayText(title)}</Text>
          {richText && <RichText value={richText} />}
        </div>
        {lists?.map((list, i) => (
          <GridListSection key={list._key || i} list={list} t={t} />
        ))}
      </div>
    </article>
  );
};

const GridListSection = ({ 
  list, 
  t 
}: { 
  list: GridList;
  t?: Awaited<ReturnType<typeof getCustomTranslations>>["t"];
}) => {
  const maxItems = list.maxItems || 6;
  const displayItems = list.items?.slice(0, maxItems) || [];
  const itemCount = displayItems.length;

  return (
    <section className={styles.listSection}>
      <Text type="h3">{getDisplayText(list.title)}</Text>
      <ul className={`${styles.list} ${getGridClassForItemCount(itemCount)}`}>
        {displayItems.map((item) => (
          <GridElement key={item._key || item._id} item={item} t={t} />
        ))}
      </ul>
    </section>
  );
};

const GridElement = ({
  item,
  slug,
  t,
}: {
  item: EventDocument | AvailablePositionDocument | GridItem;
  slug?: string;
  t?: Awaited<ReturnType<typeof getCustomTranslations>>["t"];
}) => {
  const isPosition = "slug" in item;
  const content = isPosition ? item.lead : item.richText;

  const link =
    isPosition && t
      ? {
          _key: `${item.slug?.current}`,
          _type: "link",
          title: t(GlobalTranslationKey.readMore),
          type: LinkType.Internal,
          internalLink: {
            _ref: `${item.slug?.current}?type=${CONTENT_TYPES.POSITION}`,
          },
        }
      : isPosition && slug
        ? {
            _key: `${slug}/${item.slug}`,
            _type: "link",
            title: t?.(GlobalTranslationKey.readMore),
            type: LinkType.Internal,
            internalLink: {
              _ref: `${slug}/${item.slug}?type=${CONTENT_TYPES.POSITION}`,
            },
          }
        : "link" in item
          ? item.link
          : undefined;

  return (
    <li className={styles.listItem}>
      {"image" in item && item.image && (
        <div className={styles.image}>
          <SanityNextImage image={item.image} />
        </div>
      )}
      {item.title && <Text type="h4">{getDisplayText(item.title)}</Text>}
      {content &&
        (typeof content === "string" ? (
          <Text type="small">{isPosition ? content : truncateText(content, 250)}</Text>
        ) : Array.isArray(content) && content.length > 0 ? (
          <PortableText value={content} components={myPortableTextComponents} />
        ) : null)}
      {link?.title && (
        <div>
          <CustomLink link={link} />
        </div>
      )}
    </li>
  );
};

export default Grid;
