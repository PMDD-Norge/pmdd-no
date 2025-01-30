import { LegalDocument } from "@/sanity/lib/interfaces/admin";
import styles from "./legal.module.css";
import Text from "@/components/text/Text";
import QuickNavigation from "@/components/navigation/quickNavigation/QuickNavigation";
import { RichText } from "@/components/richText/RichText";

const Legal = ({
  document,
  language,
}: {
  document: LegalDocument;
  language: string;
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <Text type="h1">{document.title}</Text>
      </div>
      <div className={styles.body}>
        <QuickNavigation
          richText={document.richText}
          language={language}
          isMainLayout={false}
        />
        <div className={styles.document}>
          <RichText value={document.richText} />
        </div>
      </div>
    </div>
  );
};

export default Legal;
