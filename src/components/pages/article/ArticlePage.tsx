import styles from "./article.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
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
          <div className={styles.author}>
            <Text type="body">
              <b>{author.name}</b>
            </Text>
            <Text type="small">{author.name}</Text>
            {author.role && <Text type="label">{author.role}</Text>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
