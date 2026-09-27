import styles from "./information.module.css";
import CategoryNavigation from "./components/categoryNavigation/CategoryNavigation";
import PMDDErrorMessage from "./components/customErrorMessage/PMDDErrorMessage";
import {
  Category,
  InformationDocument,
  PostDocument,
} from "@/sanity/lib/interfaces/pages";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import Contact from "@/components/sections/contact/Contact";
import Link from "next/link";
import { truncateText } from "@/utils/textUtils";

interface InformationProps {
  information: InformationDocument;
  categories: Category[];
  posts: PostDocument[];
  slug: string;
  postCount: number;
  currentPage: number;
  selectedCategoryName?: string;
}

export async function Information({
  information,
  posts: initialPosts,
  slug,
  categories,
  selectedCategoryName,
}: InformationProps) {
  const { title, richText, contactSection } = information;

  const categoriesToShow = [
    {
      _id: "all",
      _type: "category",
      name: `Alle ${information?.allPostsLabel}`,
    },
    ...(categories || []),
  ];

  if (!initialPosts) {
    return <PMDDErrorMessage />;
  }

  const sortedPosts = [...initialPosts].sort((a, b) => {
    const aDate =
      (a as PostDocument & { publishedAt?: string }).publishedAt ??
      a._createdAt ??
      "";
    const bDate =
      (b as PostDocument & { publishedAt?: string }).publishedAt ??
      b._createdAt ??
      "";
    return bDate.localeCompare(aDate);
  });

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.informasjonsInnhold}`}>
        <div className={styles.informasjonsHero}>
          {title && <Text type="h1">{title}</Text>}
          {richText && <RichText value={richText} paragraphType="bodyLarge" />}
        </div>
        <CategoryNavigation
          categories={categoriesToShow}
          selectedCategory={selectedCategoryName}
          slug={slug}
        />
        <ul
          className={styles.artikler}
          aria-label={title}
          aria-live="polite"
          role="region"
        >
          {sortedPosts?.map(
            ({ _id, title: postTitle, lead, slug: postSlug }) => (
              <li key={_id}>
                <Link
                  href={`/${slug}/${postSlug.current}`}
                  className={styles.artikkel}
                  aria-label={postTitle ? `Les meir: ${postTitle}` : undefined}
                >
                  {postTitle && (
                    <Text type="h4" as="h3">
                      {postTitle}
                    </Text>
                  )}
                  {lead && <Text>{truncateText(lead, 150)}</Text>}
                  <span className={styles.lesMer} aria-hidden="true">
                    Les mer
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
        {contactSection && <Contact contact={contactSection} />}
      </div>
    </>
  );
}
