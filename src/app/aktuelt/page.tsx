import { sanityFetch } from "@/sanity/lib/live";
import {
  AKTUELT_BY_SLUG_QUERY,
  ALL_AKTIVITETER_QUERY,
} from "@/sanity/lib/queries";
import {
  AktueltDocument,
  AktivitetDocument,
  AktivitetMedSlug,
} from "@/sanity/lib/interfaces/pages";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import { lagAktivitetSlugs } from "@/utils/aktivitetSlug";
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

// Dagens dato (ÅÅÅÅ-MM-DD) i norsk tid. Aktiviteter er "kommende" til og med
// dagen de holdes.
const idagOslo = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });

// Fjerner aktiviteter med utløpt dato og sorterer på dato og klokkeslett.
// Aktiviteter uten dato vises alltid og havner sist.
const kommendeAktiviteter = (aktiviteter: AktivitetMedSlug[]) => {
  const idag = idagOslo();
  return aktiviteter
    .filter(({ detaljer }) => !detaljer?.dato || detaljer.dato >= idag)
    .sort((a, b) =>
      `${a.detaljer?.dato ?? "9999-12-31"} ${a.detaljer?.tid ?? ""}`.localeCompare(
        `${b.detaljer?.dato ?? "9999-12-31"} ${b.detaljer?.tid ?? ""}`,
      ),
    );
};

export default async function AktueltPage() {
  const [{ data }, { data: aktiviteterData }] = await Promise.all([
    sanityFetch({ query: AKTUELT_BY_SLUG_QUERY, params: { slug: SLUG } }),
    sanityFetch({ query: ALL_AKTIVITETER_QUERY, params: {} }),
  ]);
  const document = data as AktueltDocument | null;
  const alleAktiviteter = (aktiviteterData || []) as (AktivitetDocument & {
    _id: string;
  })[];
  // Slugs regnes ut over alle aktivitetene, også utløpte, så adressene ikke
  // endrer seg når en aktivitet med lik tittel faller ut av listen.
  const slugs = lagAktivitetSlugs(alleAktiviteter);
  const aktiviteter = kommendeAktiviteter(
    alleAktiviteter.map((a) => ({ ...a, slug: slugs.get(a._id)! })),
  );

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
