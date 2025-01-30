import { GridItem, GridList, GridObject } from "@/sanity/lib/interfaces/pages";
import styles from "./grid.module.css";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { ColorTheme } from "@/sanity/schemaTypes/fields/appearance";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";

const Grid = ({ grid }: { grid: GridObject }) => {
  const { appearance, title, richText, lists } = grid;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  return (
    <article className={theme} id={grid._key}>
      <div className="sectionWrapperColumn">
        <div className={styles.textWrapper}>
          <Text type="h2" id="grid-title">
            {title}
          </Text>
          {richText && <RichText value={richText} />}
        </div>
        {lists?.map((list, index) => (
          <GridListSection key={list._key || index} list={list} />
        ))}
      </div>
    </article>
  );
};

const GridListSection = ({ list }: { list: GridList }) => {
  const itemCount = list.items?.length || 0;

  return (
    <section className={styles.listSection}>
      <Text type="h3">{list.title}</Text>
      <ul
        className={`${styles.list} ${
          itemCount === 1
            ? styles.oneItem
            : itemCount === 2
              ? styles.twoItems
              : ""
        }`}
      >
        {list.items?.map((item) => <GridElement key={item._key} item={item} />)}
      </ul>
    </section>
  );
};

export const GridElement = ({ item }: { item: GridItem }) => {
  return (
    <li className={styles.listItem}>
      {item.image && (
        <div className={styles.image}>
          <SanityNextImage image={item.image} />
        </div>
      )}
      {item.title && <Text type="h4">{item.title}</Text>}
      {item.richText && (
        <PortableText
          value={item.richText}
          components={myPortableTextComponents}
        />
      )}
      {item.link?.title && (
        <div>
          <CustomLink link={item.link} />
        </div>
      )}
    </li>
  );
};

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="small">{children}</Text>,
};

export default Grid;
