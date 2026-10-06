import styles from "./article.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
import SanityNextImage from "@/components/image/sanityImage";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { overordnetForArtikkel } from "@/utils/breadcrumbs";

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
}

const ArticlePage = async ({ article }: ArticlePageProps) => {
  if (!article) {
    return null;
  }

  const { title, excerpt, lead, body, richText, author } = article;

  // Use body if available, otherwise use richText
  const content = body || richText;
  // Use excerpt if available, otherwise use lead
  const description = excerpt || lead;

  return (
    <div>
      <div className={`sectionWrapperColumn ${styles.artikkel}`}>
        <Breadcrumbs
          items={[
            overordnetForArtikkel(article._type, article.type),
            { label: title },
          ]}
        />
        <div className={styles.artikkelHero}>
          {title && <Text type="h1">{title}</Text>}
          {description && <Text type="bodyLarge">{description}</Text>}
        </div>
        {content && <RichText value={content} />}
        {author?.name && (
          <section className={styles.author}>
            {author.image?.asset && (
              <div className={styles.authorBilde}>
                <SanityNextImage image={author.image} sizes="5rem" />
              </div>
            )}
            <div className={styles.authorTekst}>
              <Text type="small">Skrevet av</Text>
              <Text type="body">
                <b>{author.name}</b>
              </Text>
              {author.role && <Text type="small">{author.role}</Text>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
