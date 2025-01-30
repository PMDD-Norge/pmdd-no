import { Category } from "@/sanity/lib/interfaces/pages";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { getCustomTranslations } from "@/utils/translations";
import styles from "./categoryNavigation.module.css";
import Link from "next/link";
import Text from "@/components/text/Text";

const CategoryNavigation = async ({
  categories,
  selectedCategory: selectedCategoryName,
  language,
  slug,
}: {
  categories: Category[];
  selectedCategory?: string | null;
  language: string;
  slug: string;
}) => {
  const { t } = await getCustomTranslations(language);

  return (
    <div className={styles.wrapper}>
      {categories.length > 2 && (
        <>
          <Text type="h3">{t(GlobalTranslationKey.filterByCategory)}</Text>
          <nav className={styles.tabList}>
            {categories.map((category, index) => {
              const isSelected = !selectedCategoryName
                ? index === 0
                : selectedCategoryName === category.name;

              // If it's "All" category, don't add the category parameter
              const href =
                category._id === "all"
                  ? `/${language}/${slug}`
                  : `/${language}/${slug}?category=${category.name}`;

              return (
                <Link
                  key={category._id}
                  href={href}
                  className={`${styles.tab} ${isSelected ? styles.selected : ""}`}
                  aria-current={isSelected ? "page" : undefined}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
};

export default CategoryNavigation;
