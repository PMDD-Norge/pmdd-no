import Text from "@/components/text/Text";
import styles from "./callout.module.css";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { CalloutObject } from "@/sanity/lib/interfaces/pages";
import { ColorTheme, ImagePosition } from "@/sanity/lib/interfaces/appearance";
import SanityNextImage from "@/components/image/sanityImage";

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="bodySuperLarge">{children}</Text>,
};

const Callout = ({ callout }: { callout: CalloutObject }) => {
  const { appearance, richText } = callout;
  const image = appearance?.image;
  const imagePosition = appearance?.layout?.imagePosition;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";
  return (
    callout.richText && (
      <article className={theme} id={callout._key}>
        <div
          className={`${styles.sectionWrapperRow} ${imagePosition == ImagePosition.Left ? "" : styles.imagePositionLeftOnSmallerScreens}`}
        >
          {image && (
            <div className={styles.image}>
              <SanityNextImage image={image} />
            </div>
          )}
          <div className={styles.maxWrapper}>
            <PortableText
              value={richText}
              components={myPortableTextComponents}
            />
          </div>
        </div>
      </article>
    )
  );
};

export default Callout;
