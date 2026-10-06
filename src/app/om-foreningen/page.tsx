import { sanityFetch } from "@/sanity/lib/live";
import { OM_FORENINGEN_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import {
  OmForeningenDocument,
  OmForeningenPersonSeksjon,
  OmForeningenPerson,
  OmForeningenStyrendeDokument,
} from "@/sanity/lib/interfaces/pages";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import LinkButton from "@/components/linkButton/LinkButton";
import styles from "./omForeningen.module.css";
import CustomLink from "@/components/link/CustomLink";

export const revalidate = 86400;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "om-foreningen";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

const tilDokumentlenke = (dok: OmForeningenStyrendeDokument): SanityLink => ({
  _key: dok._id,
  _type: "link",
  title: dok.title,
  type: LinkType.Internal,
  internalLink: {
    _ref: dok._id,
    _type: "legalDocument",
    slug: dok.slug,
  },
});

const PersonKort = ({ person }: { person: OmForeningenPerson }) => (
  <li className={styles.personKort}>
    {person.image?.asset && (
      <div className={styles.personBilde}>
        <SanityNextImage image={person.image} />
      </div>
    )}
    <Text type="h4" as="h4">
      {person.name}
    </Text>
    {person.occupation && <Text type="small">{person.occupation}</Text>}
  </li>
);

const PersonSeksjon = ({ seksjon }: { seksjon: OmForeningenPersonSeksjon }) => {
  const { tittel, body, folk } = seksjon;
  if (!folk || folk.length === 0) return null;

  return (
    <div className={styles.personSeksjon}>
      {tittel && <Text type="h3">{tittel}</Text>}
      {body && <RichText value={body} />}
      <ul className={styles.personListe}>
        {folk.map((person) => (
          <PersonKort key={person._id} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default async function OmForeningenPage() {
  const { data } = await sanityFetch({
    query: OM_FORENINGEN_BY_SLUG_QUERY,
    params: { slug: SLUG },
  });
  const document = data as OmForeningenDocument | null;

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const {
    title,
    ingress,
    richText,
    heroImage,
    organisasjonenVaar,
    styrendeDokumenter,
  } = document;

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <div className={styles.hero}>
        {title && <Text type="h1">{title}</Text>}
        {ingress && <Text type="bodyLarge">{ingress}</Text>}
      </div>

      <div className={styles.pageContent}>
        {richText && <RichText value={richText} />}
        {organisasjonenVaar && (
          <section className={styles.seksjon}>
            {organisasjonenVaar.tittel && (
              <Text type="h2">{organisasjonenVaar.tittel}</Text>
            )}
            {organisasjonenVaar.richText && (
              <RichText value={organisasjonenVaar.richText} />
            )}
            {organisasjonenVaar.seksjoner?.map((seksjon) => (
              <PersonSeksjon key={seksjon._key} seksjon={seksjon} />
            ))}
            {organisasjonenVaar.oppfordring && (
              <div className={styles.oppfordring}>
                {organisasjonenVaar.oppfordring.tittel && (
                  <Text type="h3">{organisasjonenVaar.oppfordring.tittel}</Text>
                )}
                {organisasjonenVaar.oppfordring.richText && (
                  <RichText value={organisasjonenVaar.oppfordring.richText} />
                )}
                {organisasjonenVaar.oppfordring.lenker && (
                  <div className={styles.lenker}>
                    {organisasjonenVaar.oppfordring.lenker.map((lenke, i) => (
                      <LinkButton
                        key={lenke._key ?? i}
                        type={i === 0 ? "secondary" : "primary"}
                        link={lenke}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
        {styrendeDokumenter?.dokumenter &&
          styrendeDokumenter.dokumenter.length > 0 && (
            <section className={styles.seksjon}>
              {styrendeDokumenter.tittel && (
                <Text type="h2">{styrendeDokumenter.tittel}</Text>
              )}
              {styrendeDokumenter.richText && (
                <RichText value={styrendeDokumenter.richText} />
              )}
              <ul className={styles.dokumentListe}>
                {styrendeDokumenter.dokumenter.map((dok) => (
                  <li key={dok._id}>
                    <CustomLink link={tilDokumentlenke(dok)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
      </div>
    </div>
  );
}
