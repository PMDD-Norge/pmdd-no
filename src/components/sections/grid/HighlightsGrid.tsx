import {
  AvailablePositionDocument,
  EventDocument,
} from "@/sanity/lib/interfaces/pages";
import styles from "./grid.module.css";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { getCustomTranslations } from "@/utils/translations";
import { CONTENT_TYPES } from "@/utils/constants/contentTypes";
import { truncateText } from "@/utils/textUtils";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";

const HighlightsGrid = ({
  title,
  richText,
  items,
  slug,
  language,
}: {
  title: string;
  richText?: PortableTextBlock[];
  items: EventDocument[] | AvailablePositionDocument[];
  slug: string;
  language: string;
}) => {
  const itemCount = items?.length || 0;
  return (
    <article className="darkBackground">
      <div className="sectionWrapperColumn">
        <div className={styles.textWrapper}>
          {title && <Text type="h2">{title}</Text>}
          {richText && <RichText value={richText} />}
        </div>
        {items && (
          <div className={styles.listSection}>
            <ul
              className={`${styles.list} ${
                itemCount === 1
                  ? styles.oneItem
                  : itemCount === 2
                    ? styles.twoItems
                    : ""
              }`}
            >
              {items?.map((item, index) => (
                <li key={`${item._key}-${index}`} className={styles.listItem}>
                  <GridElement item={item} slug={slug} language={language} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

const isEventDocument = (
  item: EventDocument | AvailablePositionDocument
): item is EventDocument => {
  return "image" in item && "link" in item;
};

const isAvailablePosition = (
  item: EventDocument | AvailablePositionDocument
): item is AvailablePositionDocument => {
  return "slug" in item;
};

export const GridElement = async ({
  item,
  slug,
  language,
}: {
  item: EventDocument | AvailablePositionDocument;
  slug: string;
  language: string;
}) => {
  const { t } = await getCustomTranslations(language);
  const { title } = item;
  const content = isEventDocument(item)
    ? item.richText
    : item.lead || item.richText;

  const postLink =
    isAvailablePosition(item) &&
    `${slug}/${item.slug}?type=${CONTENT_TYPES.POSITION}`;

  const truncatedLead =
    isAvailablePosition(item) && truncateText(item.lead, 250);

  const internalLink = {
    _ref: String(postLink),
  };

  const link = isAvailablePosition(item)
    ? {
        _key: String(postLink),
        _type: "link",
        title: t(GlobalTranslationKey.readMore),
        type: LinkType.Internal,
        internalLink,
      }
    : item.link;

  return (
    <>
      {isEventDocument(item) && item.image && (
        <div className={styles.image}>
          <SanityNextImage image={item.image} />
        </div>
      )}
      {title && <Text type="h4">{title}</Text>}
      {content &&
        (typeof content === "string" ? (
          <Text type="small">{truncatedLead}</Text>
        ) : (
          <PortableText value={content} components={myPortableTextComponents} />
        ))}
      <div>
        <CustomLink link={link} />
      </div>
    </>
  );
};

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="small">{children}</Text>,
};

export default HighlightsGrid;
