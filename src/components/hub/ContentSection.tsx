import Grid from "@/components/sections/grid/Grid";
import CategoryNavigation from "@/components/pages/information/components/categoryNavigation/CategoryNavigation";
import PostPreviewGrid from "@/components/pages/information/components/postPreviewGrid/PostPreviewGrid";
import {
  Category,
  EventDocument,
  AvailablePositionDocument,
  GridItem,
  PostDocument,
  GridList,
} from "@/sanity/lib/interfaces/pages";

type ContentItem = EventDocument | AvailablePositionDocument | GridItem | PostDocument;

interface ContentSectionProps {
  title?: string;
  description?: string;
  items: ContentItem[];
  type: string;
  showFilters?: boolean;
  categories?: Category[];
  layout?: string;
  slug: string;
}

/**
 * ContentSection component - renders a section of content items
 * Uses existing Grid component for consistent styling
 */
export default async function ContentSection({
  title,
  description,
  items,
  type,
  showFilters,
  categories,
  slug,
}: ContentSectionProps) {
  // For blog-post and news with filters, use special handling
  if ((type === "blog-post" || type === "news") && showFilters && categories) {
    const categoriesToShow = [
      {
        _id: "all",
        _type: "category" as const,
        name: "Alle",
      },
      ...(categories || []),
    ];

    return (
      <div className="darkBackground">
        <div className="sectionWrapperColumn">
          <CategoryNavigation
            categories={categoriesToShow}
            selectedCategory={undefined}
            slug={slug}
          />
          <section aria-live="polite" role="region">
            <PostPreviewGrid
              title={title || ""}
              posts={items as PostDocument[]}
              numberOfPosts={items.length}
              initialLoading={false}
              slug={slug}
              currentPage={1}
            />
          </section>
        </div>
      </div>
    );
  }

  // For all other types, use Grid component
  return (
    <Grid
      grid={{
        _type: "grid",
        _key: `content-${type}`,
        title: title || "",
        richText: description ? [{ _type: "block", children: [{ _type: "span", text: description }] }] : undefined,
        lists: [
          {
            _type: "gridList",
            _key: `list-${type}`,
            title: title || "",
            contentType: type as GridList["contentType"],
            items: items,
            maxItems: items.length,
          },
        ],
      }}
    />
  );
}
