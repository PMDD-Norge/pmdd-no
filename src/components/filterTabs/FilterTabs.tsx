"use client";

import styles from "./filterTabs.module.css";
import Text from "@/components/text/Text";

export interface FilterTabItem {
  id: string;
  label: string;
}

interface FilterTabsProps {
  title: string;
  items: FilterTabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  isPending?: boolean;
}

/**
 * Faner for filtrering av lister. Brukes både av kategorifilteret på
 * informasjonssiden og typefilteret på Aktuelt, slik at de ser likt ut.
 */
const FilterTabs = ({
  title,
  items,
  selectedId,
  onSelect,
  isPending,
}: FilterTabsProps) => (
  <div className={styles.filtrering} data-pending={isPending || undefined}>
    <Text type="h4">{title}</Text>
    <nav className={styles.tabList}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (!isSelected) onSelect(item.id);
            }}
            className={`${styles.tab} ${isSelected ? styles.selected : ""}`}
            aria-current={isSelected ? "page" : undefined}
            disabled={isPending}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export default FilterTabs;
