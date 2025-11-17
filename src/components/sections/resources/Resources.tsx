"use client";
import { useState, useRef } from "react";
import styles from "./resources.module.css";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { ResourcesObject } from "@/sanity/lib/interfaces/pages";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import Text from "@/components/text/Text";
import Card from "@/components/cards/Card";
import Button from "@/components/buttons/Button";

// Color theme enum (since we can't import from removed schemas)
enum ColorTheme {
  Light = "light",
  Dark = "dark",
}

interface ResourcesProps {
  resources: ResourcesObject;
}

interface ResourceGroup {
  title?: string;
  links: SanityLink[];
}

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="bodyLarge">{children}</Text>,
};

const itemsPerLoad = 4;

const ResourceGroup = ({
  group,
  visibleItemCount,
  firstNewItemRef,
}: {
  group: ResourceGroup;
  visibleItemCount: number;
  firstNewItemRef: React.RefObject<HTMLLIElement>;
}) => (
  <div className={styles.group}>
    {group.title && <Text type="h3">{group.title}</Text>}
    <ul className={styles.list}>
      {group.links?.slice(0, visibleItemCount).map((resourceItem, index) => (
        <li
          key={`resource-${index}`}
          ref={
            index === visibleItemCount - itemsPerLoad
              ? firstNewItemRef
              : undefined
          }
        >
          <Card link={resourceItem} />
        </li>
      ))}
    </ul>
  </div>
);

const Resources = ({ resources }: ResourcesProps) => {
  const { title, richText, groupedLinks, appearance } = resources;

  const backgroundTheme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  const totalResourceCount =
    groupedLinks?.reduce(
      (total, group) => total + (group.links?.length || 0),
      0
    ) ?? 0;

  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerLoad);

  const remainingItemCount = totalResourceCount - visibleItemCount;
  const isShowingLastBatch = remainingItemCount <= itemsPerLoad;

  const loadMoreText = isShowingLastBatch
    ? `Vis siste ${remainingItemCount} ressurser`
    : `Vis ${itemsPerLoad} flere ressurser`;

  const firstNewItemRef = useRef<HTMLLIElement>(null);

  const loadMoreItems = () => {
    if (totalResourceCount > visibleItemCount) {
      setVisibleItemCount((currentCount) => currentCount + itemsPerLoad);

      setTimeout(() => {
        // Focus the first interactive element (Card) inside the li
        const cardElement = firstNewItemRef.current?.querySelector("a");
        cardElement?.focus();
      }, 0);
    }
  };

  return (
    <article className={backgroundTheme} id={resources._key}>
      <div className={styles.content}>
        <Text type="h2">{title}</Text>
        {richText && (
          <PortableText
            value={richText}
            components={myPortableTextComponents}
          />
        )}
        {groupedLinks?.map((group, index) => (
          <ResourceGroup
            key={`group-${index}`}
            group={group}
            visibleItemCount={visibleItemCount}
            firstNewItemRef={firstNewItemRef}
          />
        ))}
        {totalResourceCount > visibleItemCount && (
          <div className={styles.buttonWrapper}>
            <Button
              onClick={loadMoreItems}
              size="small"
              type="secondary"
              showChevron
            >
              {loadMoreText}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default Resources;
