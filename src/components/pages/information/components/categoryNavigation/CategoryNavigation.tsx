"use client";

import { Category } from "@/sanity/lib/interfaces/pages";
import styles from "./categoryNavigation.module.css";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Text from "@/components/text/Text";

const CategoryNavigation = ({
  categories,
  selectedCategory: selectedCategoryName,
  slug,
}: {
  categories: Category[];
  selectedCategory?: string | null;
  slug: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (categories.length <= 1) {
    return <div className={styles.wrapper} />;
  }

  return (
    <div className={styles.filtrering} data-pending={isPending || undefined}>
      <Text type="h4">Sorter artikkler etter kategori</Text>
      <nav className={styles.tabList}>
        {categories.map((category, index) => {
          const isSelected = !selectedCategoryName
            ? index === 0
            : selectedCategoryName === category.name;

          const href =
            category._id === "all"
              ? `/${slug}`
              : `/${slug}?category=${encodeURIComponent(category._id)}`;

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => {
                if (isSelected) return;
                startTransition(() => {
                  router.push(href, { scroll: false });
                });
              }}
              className={`${styles.tab} ${isSelected ? styles.selected : ""}`}
              aria-current={isSelected ? "page" : undefined}
              disabled={isPending}
            >
              {category.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CategoryNavigation;
