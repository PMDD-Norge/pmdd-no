import { LegalDocument } from "@/sanity/lib/interfaces/admin";
import styles from "./legal.module.css";
import Text from "@/components/text/Text";
import QuickNavigation from "@/components/navigation/quickNavigation/QuickNavigation";
import { RichText } from "@/components/richText/RichText";
import { extractH2TextsFromPortableText } from "@/utils/textUtils";

const Legal = ({
  document,
  slug,
}: {
  document: LegalDocument;
  slug: string;
}) => {
  const hasQuickNav =
    extractH2TextsFromPortableText(document.richText).length > 0;

  return (
    <div
      className={`${styles.wrapper} ${!hasQuickNav ? styles.noQuickNav : ""}`}
    >
      <div className={styles.hero}>
        <Text type="h1">{document.title}</Text>
      </div>
      <div className={styles.body}>
        {hasQuickNav && (
          <QuickNavigation
            richText={document.richText}
            isMainLayout={false}
            currentSlug={slug}
          />
        )}
        <div className={styles.document}>
          <RichText value={document.richText} />
        </div>
      </div>
    </div>
  );
};

export default Legal;
