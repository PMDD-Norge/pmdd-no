import SanityNextImage from "@/components/image/sanityImage";
import styles from "./article.module.css";
import { ArticleObject } from "@/sanity/lib/interfaces/pages";
import {
  ColorTheme,
  ImagePosition,
} from "@/sanity/lib/interfaces/appearance";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import { getDisplayText } from "@/utils/textUtils";
import { cn } from "@/utils/cn";

const Article = ({ article }: { article: ArticleObject }) => {
  const { appearance, callToActions, mediaType, image, iframeUrl } = article;
  const imagePosition = appearance?.layout?.imagePosition;
  const mediaIsIframe = mediaType === "iframe" && iframeUrl;
  const appearanceImage = appearance?.image;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  const renderMedia = () => {
    // Priority 1: iframe
    if (mediaIsIframe) {
      return (
        <div className={styles.iframe}>
          <iframe
            src={iframeUrl}
            title="Embedded content"
            allowFullScreen
            style={{ overflow: "hidden", height: "100%", width: "100%" }}
            height="100%"
            width="100%"
          />
        </div>
      );
    }

    // Priority 2: main image when mediaType is set to image
    if (mediaType === "image" && image) {
      return (
        <div className={styles.image}>
          <SanityNextImage image={image} />
        </div>
      );
    }

    // Priority 3: appearance image (fallback)
    if (appearanceImage) {
      return (
        <div className={styles.image}>
          <SanityNextImage image={appearanceImage} />
        </div>
      );
    }

    return null;
  };

  return (
    <article className={theme} id={article._key}>
      <div
        className={cn(
          styles.sectionWrapperRow,
          imagePosition !== ImagePosition.Left && "imagePositionAlwaysLeftOnMobile"
        )}
      >
        {renderMedia()}
        <div className={styles.content}>
          <div>
            <Text type="caption">{article.tag}</Text>
            <Text type="h2">{getDisplayText(article.title)}</Text>
          </div>
          {article.richText && <RichText value={article.richText} />}
          {callToActions && (
            <ul className={styles.list}>
              {callToActions?.map((cta, index) => (
                <li key={`cta-${index}`}>
                  <LinkButton
                    link={cta}
                    type={index === 0 ? "primary" : "secondary"}
                  />
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
