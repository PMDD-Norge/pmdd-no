import { CallToActionObject } from "@/sanity/lib/interfaces/pages";
import styles from "./callToAction.module.css";
import {
  ColorTheme,
  ImagePosition,
} from "@/sanity/schemaTypes/fields/appearance";
import SanityNextImage from "@/components/image/sanityImage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";

interface CallToActionProps {
  callToAction: CallToActionObject;
}

const CallToAction = ({ callToAction }: CallToActionProps) => {
  const { appearance, title, richText, callToActions } = callToAction;
  const image = appearance.image;
  const imagePosition = appearance?.layout?.imagePosition;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  return (
    <article className={theme} id={callToAction._key}>
      <div
        className={`${styles.sectionWrapperRow} ${styles.content} ${imagePosition == ImagePosition.Left ? "" : styles.imagePositionLeftOnSmallerScreens}`}
      >
        {image && (
          <div className={styles.image}>
            <SanityNextImage image={image} />
          </div>
        )}
        <div className={styles.textWrapper}>
          <Text type="h2">{title}</Text>
          {richText && <RichText value={richText} />}
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
        </div>
      </div>
    </article>
  );
};

export default CallToAction;
