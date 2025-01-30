import Text from "@/components/text/Text";
import styles from "./callout.module.css";
import { PortableText } from "@portabletext/react";
import { CalloutObject } from "@/sanity/lib/interfaces/pages";
import { ColorTheme } from "@/sanity/schemaTypes/fields/appearance";

const myPortableTextComponents = {
  block: ({ children }: any) => <Text type="bodySuperLarge">{children}</Text>,
};

const Callout = ({ callout }: { callout: CalloutObject }) => {
  const { appearance, richText } = callout;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";
  return (
    callout.richText && (
      <article className={theme} id={callout._key}>
        <div className={styles.sectionWrapperRow}>
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
