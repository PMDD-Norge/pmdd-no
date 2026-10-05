"use client";

import { Category } from "@/sanity/lib/interfaces/pages";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import FilterTabs from "@/components/filterTabs/FilterTabs";

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
    return <div />;
  }

  const selected =
    categories.find((category) => category.name === selectedCategoryName) ??
    categories[0];

  return (
    <FilterTabs
      title="Sorter artikkler etter kategori"
      items={categories.map((category) => ({
        id: category._id,
        label: category.name,
      }))}
      selectedId={selected._id}
      isPending={isPending}
      onSelect={(id) => {
        const href =
          id === "all"
            ? `/${slug}`
            : `/${slug}?category=${encodeURIComponent(id)}`;
        startTransition(() => {
          router.push(href, { scroll: false });
        });
      }}
    />
  );
};

export default CategoryNavigation;
