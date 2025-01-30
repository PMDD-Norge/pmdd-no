import { PostDocument } from "@/sanity/lib/interfaces/pages";
import styles from "./post.module.css";
import { getCustomTranslations } from "@/utils/translations";
import Text from "@/components/text/Text";
import QuickNavigation from "@/components/navigation/quickNavigation/QuickNavigation";
import { RichText } from "@/components/richText/RichText";

const PostPage = async ({
  post,
  language,
}: {
  post: PostDocument;
  language: string;
}) => {
  if (!post) {
    return;
  }

  // const publishedString = t(GlobalTranslationKey.published) || "Published";
  const { title, lead, richText } = post;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        {/* <Text
          type="caption"
          className={styles.date}
        >{`${publishedString} ${formatDate(date, language)}`}</Text> */}

        {title && <Text type="h1">{title}</Text>}
        {lead && <Text type="bodyLarge">{lead}</Text>}
        {richText && (
          <QuickNavigation richText={richText} language={language} />
        )}

        {/* {image && (
          <div className={styles.headerImage}>
            <SanityImage image={image} />
            <Text type="caption" className={styles.caption}>
              {image.description}
            </Text>
            <Text type="caption" className={styles.caption}>
              {image.credits}
            </Text>
          </div>
        )} */}
      </div>
      <div className="darkBackground">
        <div className={`sectionWrapperColumn ${styles.body}`}>
          {/* <div className={styles.credits}>
          <div className={styles.author}>
            {author?.image && (
              <div className={styles.authorImage}>
                <SanityImage image={author.image} />
              </div>
            )}
            <div className={styles.authorInfo}>
              <Text type="small" className={styles.authorName}>
                {author?.name}
              </Text>
              <Text type="small">{author?.occupation}</Text>
            </div>
          </div>
        </div> */}
          {richText && <RichText value={richText} />}
        </div>
      </div>
    </>
  );
};

export default PostPage;
