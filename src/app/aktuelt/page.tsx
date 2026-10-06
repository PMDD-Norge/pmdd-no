import { sanityFetch } from "@/sanity/lib/live";
import {
  AKTUELT_BY_SLUG_QUERY,
  ALL_AKTIVITETER_QUERY,
} from "@/sanity/lib/queries";
import {
  AktueltDocument,
  AktivitetDocument,
} from "@/sanity/lib/interfaces/pages";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import AktivitetListe from "./AktivitetListe";
import styles from "./aktuelt.module.css";

// Kortere intervall enn andre sider, så aktiviteter med utløpt dato forsvinner raskt
export const revalidate = 3600;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "aktuelt";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

export default async function AktueltPage() {
  const [{ data }, { data: aktiviteterData }] = await Promise.all([
    sanityFetch({ query: AKTUELT_BY_SLUG_QUERY, params: { slug: SLUG } }),
    sanityFetch({ query: ALL_AKTIVITETER_QUERY, params: {} }),
  ]);
  const document = data as AktueltDocument | null;
  const aktiviteter = (aktiviteterData || []) as AktivitetDocument[];

  if (!document) {
    return <PMDDErrorMessage />;
  }

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
}
