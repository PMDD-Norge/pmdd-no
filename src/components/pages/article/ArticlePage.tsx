import styles from "./article.module.css";
import Text from "@/components/text/Text";
import QuickNavigation from "@/components/navigation/quickNavigation/QuickNavigation";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "@/sanity/lib/interfaces/media";

interface ArticlePageProps {
  article: {
    _id: string;
    _type: string;
    type?: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    lead?: string;
    body?: PortableTextBlock[];
    richText?: PortableTextBlock[];
    tag?: string;
    publishedAt?: string;
    image?: SanityImageData;
    author?: {
      name: string;
      role?: string;
      image?: SanityImageData;
    };
    categories?: Array<{
      _id: string;
      name: string;
    }>;
  };
  currentSlug: string;
  showQuickNavigation?: boolean;
}

const ArticlePage = async ({ article, currentSlug, showQuickNavigation = true }: ArticlePageProps) => {
  if (!article) {
    return null;
  }

  const {
    title,
    excerpt,
    lead,
    body,
    richText,
    tag,
    image,
    author,
    publishedAt,
  } = article;

  // Use body if available, otherwise use richText
  const content = body || richText;
  // Use excerpt if available, otherwise use lead
  const description = excerpt || lead;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        {tag && (
          <Text type="caption" className={styles.date}>
            {tag}
          </Text>
        )}

        {title && <Text type="h1">{title}</Text>}
        {description && <Text type="bodyLarge">{description}</Text>}

        {/* {categories && categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map((category) => (
              <span key={category._id} className={styles.category}>
                {category.name}
              </span>
            ))}
          </div>
        )} */}

        {image?.asset?._ref && (
          <div className={styles.headerImage}>
            <SanityNextImage image={image} />
          </div>
        )}

        {content && showQuickNavigation && (
          <QuickNavigation richText={content} currentSlug={currentSlug} />
        )}
      </div>

      <div className="darkBackground">
        <div className={`sectionWrapperColumn ${styles.body}`}>
          {author && (
            <div className={styles.author}>
              {author.image && (
                <div className={styles.authorImage}>
                  <SanityNextImage image={author.image} />
                </div>
              )}
              <div className={styles.authorInfo}>
                <Text type="small" className={styles.authorName}>
                  {author.name}
                </Text>
                {author.role && <Text type="small">{author.role}</Text>}
              </div>
            </div>
          )}

          {content && <RichText value={content} />}
          {!tag && publishedAt && (
            <Text className={styles.date}>
              {new Date(publishedAt).toLocaleDateString("nb-NO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
