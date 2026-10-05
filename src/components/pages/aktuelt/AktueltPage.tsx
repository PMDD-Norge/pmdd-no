import {
  AktueltDocument,
  AktivitetDocument,
} from "@/sanity/lib/interfaces/pages";
import styles from "./aktuelt.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import AktivitetListe from "./AktivitetListe";

const AktueltPage = ({
  document,
  aktiviteter,
}: {
  document: AktueltDocument;
  aktiviteter: AktivitetDocument[];
}) => {
  const { title, ingress, alleTyperLabel, cta } = document;

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <div className={styles.hero}>
        {title && <Text type="h1">{title}</Text>}
        {ingress && <Text type="bodyLarge">{ingress}</Text>}
      </div>
      {aktiviteter.length > 0 && (
        <AktivitetListe
          aktiviteter={aktiviteter}
          alleTyperLabel={alleTyperLabel || "Alle"}
        />
      )}
      {cta?.tittel && (
        <section className={styles.cta}>
          <Text type="h2">{cta.tittel}</Text>
          {cta.richText && <RichText value={cta.richText} />}
          {cta.lenke?.title && <LinkButton link={cta.lenke} />}
        </section>
      )}
    </div>
  );
};

export default AktueltPage;
