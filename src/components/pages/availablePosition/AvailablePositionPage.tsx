import { AvailablePositionDocument } from "@/sanity/lib/interfaces/pages";
import styles from "./availablePosition.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { OVERORDNEDE_SIDER } from "@/utils/breadcrumbs";

const AvailablePositionPage = ({
  document,
}: {
  document: AvailablePositionDocument;
}) => {
  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[OVERORDNEDE_SIDER.engasjerDeg, { label: document.title }]}
      />
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
