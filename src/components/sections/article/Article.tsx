import SanityNextImage from "@/components/image/sanityImage";
import styles from "./article.module.css";
import { ArticleObject } from "@/sanity/lib/interfaces/pages";
import {
  ColorTheme,
  ImagePosition,
  LinkType,
} from "@/sanity/schemaTypes/fields/appearance";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import CustomLink from "@/components/link/CustomLink";

const Article = ({ article }: { article: ArticleObject }) => {
  const { appearance, callToActions } = article;
  const imagePosition = appearance?.layout?.imagePosition;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  return (
    <article className={theme} id={article._key}>
      <div
        className={`${styles.sectionWrapperRow} ${imagePosition == ImagePosition.Left ? "" : "imagePositionAlwaysLeftOnMobile"}`}
      >
        {appearance?.image && (
          <div className={styles.image}>
            <SanityNextImage image={appearance.image} />
          </div>
        )}
        <div className={styles.content}>
          <div>
            <Text type="caption">{article.tag}</Text>
            <Text type="h2">{article.title}</Text>
          </div>
          {article.richText && <RichText value={article.richText} />}
          {callToActions && (
            <ul className={styles.list}>
              {callToActions?.map((cta, index) => (
                <li key={`cta-${index}`}>
                  {appearance?.linkType == LinkType.linkButton ? (
                    <LinkButton
                      link={cta}
                      type={index === 0 ? "primary" : "secondary"}
                    />
                  ) : (
                    <CustomLink link={cta} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
};

export default Article;
