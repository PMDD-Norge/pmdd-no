import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import {
  AKTIVITET_BY_ID_QUERY,
  AKTIVITET_ID_TITLE_QUERY,
} from "@/sanity/lib/queries";
import { AktivitetDocument } from "@/sanity/lib/interfaces/pages";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import SanityNextImage from "@/components/image/sanityImage";
import { lagAktivitetSlugs } from "@/utils/aktivitetSlug";
import { OVERORDNEDE_SIDER } from "@/utils/breadcrumbs";
import {
  INVOLVERTE_TITTEL,
  TYPE_LABELS,
  formatDato,
} from "@/utils/aktivitetUtils";
import styles from "../aktuelt.module.css";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Slugen lages fra tittelen, så vi finner dokumentet via listen over alle
// aktiviteter og henter det på ID.
const hentAktivitet = async (slug: string) => {
  const { data: alle } = await sanityFetch({
    query: AKTIVITET_ID_TITLE_QUERY,
    params: {},
  });
  const aktiviteter = (alle || []) as { _id: string; title: string }[];
  const slugs = lagAktivitetSlugs(aktiviteter);
  const id = aktiviteter.find((a) => slugs.get(a._id) === slug)?._id;
  if (!id) return null;

  const { data } = await sanityFetch({
    query: AKTIVITET_BY_ID_QUERY,
    params: { id },
  });
  return data as AktivitetDocument | null;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const aktivitet = await hentAktivitet(slug);
  return {
    title: aktivitet
      ? `${aktivitet.title} | PMDD Norge`
      : "Aktivitet | PMDD Norge",
    description: aktivitet?.ingress,
  };
}

export default async function AktivitetPage({ params }: PageProps) {
  const { slug } = await params;
  const aktivitet = await hentAktivitet(slug);

  if (!aktivitet) return <PMDDErrorMessage />;

  const { type, title, ingress, richText, detaljer, involverte } = aktivitet;
  const detaljbokser = [
    { label: "Dato", verdi: formatDato(detaljer?.dato) },
    { label: "Tid", verdi: detaljer?.tid },
    { label: "Sted", verdi: detaljer?.sted },
    { label: "Pris", verdi: detaljer?.pris },
    {
      label: "Annet",
      verdi: [
        detaljer?.wheelchairFriendly && "Rullestolvennlig",
        detaljer?.strollerFriendly && "Barnevognvennlig",
        detaljer?.bringFood && "Ta med niste",
      ]
        .filter(Boolean)
        .join(", "),
    },
  ].filter((boks) => boks.verdi);
  const personer = involverte?.personer || [];

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <Breadcrumbs items={[OVERORDNEDE_SIDER.aktuelt, { label: title }]} />
      <div className={styles.hero}>
        <Text type="bodyLarge" as="small">
          {TYPE_LABELS[type]}
        </Text>
        <Text type="h1">{title}</Text>
        {ingress && <Text type="bodyLarge">{ingress}</Text>}
      </div>

      {detaljbokser.length > 0 && (
        <section className={styles.detaljerSeksjon}>
          <Text type="h4" as="h2">
            Detaljer
          </Text>
          <dl className={styles.detaljer}>
            {detaljbokser.map(({ label, verdi }) => (
              <div key={label} className={styles.detaljBoks}>
                <Text as="dt" className={styles.detaljLabel}>
                  {label}:
                </Text>
                <Text as="dd" className={styles.detaljVerdi}>
                  {verdi}
                </Text>
              </div>
            ))}
          </dl>
        </section>
      )}

      {detaljer?.lenke?.title && <LinkButton link={detaljer.lenke} />}

      {richText && <RichText value={richText} />}

      {personer.length > 0 && (
        <section className={styles.involverte}>
          <Text type="h2">{involverte?.tittel || INVOLVERTE_TITTEL[type]}</Text>
          <ul className={styles.personer}>
            {personer.map((person) => (
              <li key={person._id} className={styles.person}>
                <div className={styles.personBilde}>
                  {person.image?.asset && (
                    <SanityNextImage image={person.image} />
                  )}
                </div>
                <div className={styles.personTekst}>
                  <Text type="h4" as="h3">
                    {person.name}
                  </Text>
                  {person.occupation && (
                    <Text type="small">{person.occupation}</Text>
                  )}
                  {person.city && <Text type="small">{person.city}</Text>}
                  {person.bio && <Text>{person.bio}</Text>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
