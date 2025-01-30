import { AvailablePositionDocument } from "@/sanity/lib/interfaces/pages";
import styles from "./availablePosition.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";

const AvailablePositionPage = ({
  document,
}: {
  document: AvailablePositionDocument;
}) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <Text type="caption">{document.tag}</Text>
        <Text type="h1">{document.title}</Text>
      </div>
      <div>
        {document.lead && <Text type="bodyLarge">{document.lead}</Text>}
      </div>
      <div className={styles.document}>
        <RichText value={document.richText} />
      </div>
    </div>
  );
};

export default AvailablePositionPage;
