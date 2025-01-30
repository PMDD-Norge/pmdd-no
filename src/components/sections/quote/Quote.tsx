import Text from "@/components/text/Text";
import styles from "./quote.module.css";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { CalloutObject } from "@/sanity/lib/interfaces/pages";

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: ({ children }) => <Text type="h2">{children}</Text>,
};

const Quote = ({ quote }: { quote: CalloutObject }) => {
  return (
    quote.richText && (
      <article className={styles.callout} id={quote._key}>
        <div className={styles.maxWrapper}>
          <PortableText
            value={quote.richText}
            components={myPortableTextComponents}
          />
        </div>
      </article>
    )
  );
};

export default Quote;
