import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { INFORMASJONSDOKUMENT_QUERY } from "@/sanity/lib/queries";
import { fetchInformationData } from "@/utils/getPageData";
import { generatePageMetadata } from "@/utils/metadata";
import { truncateText } from "@/utils/textUtils";
import type { Category, PostDocument } from "@/sanity/lib/interfaces/pages";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import CategoryNavigation from "@/components/pages/information/components/categoryNavigation/CategoryNavigation";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import styles from "./information.module.css";
import LinkButton from "@/components/linkButton/LinkButton";

const SLUG = "informasjon";

export const revalidate = 86400;

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

interface InformasjonPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function InformasjonPage({
  searchParams,
}: InformasjonPageProps) {
  const { page: pageParam, category } = await searchParams;
  const page = parseInt(pageParam || "1", 10);

  const [{ data: document }, artikkeldata] = await Promise.all([
    sanityFetch({ query: INFORMASJONSDOKUMENT_QUERY, params: {} }),
    fetchInformationData(SLUG, page, category),
  ]);

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const categories: Category[] = artikkeldata?.categories || [];
  const posts: PostDocument[] = artikkeldata?.posts || [];

  const selectedCategoryName = category
    ? categories.find((cat) => cat._id === category)?.name
    : undefined;

  const categoriesToShow = [
    {
      _id: "all",
      _type: "category",
      name: `Alle ${document?.allPostsLabel}`,
    },
    ...categories,
  ];

  const sortedPosts = [...posts].sort((a, b) => {
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

  const { title, richText, contactSection } = document;

  return (
    <div className={`sectionWrapperColumn ${styles.informasjonsInnhold}`}>
      <div className={styles.informasjonsHero}>
        {title && <Text type="h1">{title}</Text>}
        {richText && <RichText value={richText} paragraphType="bodyLarge" />}
      </div>

      <div className={styles.informasjonArtiklerSeksjon}>
        <CategoryNavigation
          categories={categoriesToShow}
          selectedCategory={selectedCategoryName}
          slug={SLUG}
        />

        <ul
          className={styles.artikler}
          aria-label={title}
          aria-live="polite"
          role="region"
        >
          {sortedPosts.map(
            ({ _id, title: postTitle, lead, slug: postSlug }) => (
              <li key={_id}>
                <Link
                  href={`/${SLUG}/${postSlug.current}`}
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
      </div>

      <div className={styles.kontaktOsswrapper}>
        <Text type="h3">{contactSection.title}</Text>
        {contactSection.richText && (
          <RichText value={contactSection.richText} />
        )}
        <ul className={styles.list}>
          {contactSection.callToActions?.map((cta, index) => (
            <li key={`cta-${index}`}>
              <LinkButton link={cta} type="secondary" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
