import { LegalDocument } from "@/sanity/lib/interfaces/admin";
import styles from "./legal.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { OVERORDNEDE_SIDER } from "@/utils/breadcrumbs";

const Legal = ({ document }: { document: LegalDocument; slug: string }) => {
  const formattedDate = document._updatedAt
    ? new Date(document._updatedAt).toLocaleDateString("nb-NO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  return (
    <div className={styles.background} data-theme="article">
      <div className={`sectionWrapperColumn ${styles.legal}`}>
        <Breadcrumbs
          items={[OVERORDNEDE_SIDER.omForeningen, { label: document.title }]}
        />
        <div>
          <Text type="h1">{document.title}</Text>
          <Text type="label">Oppdatert: {formattedDate}</Text>
        </div>
        <RichText value={document.richText} smallerHeadings />
      </div>
    </div>
  );
};

export default Legal;
