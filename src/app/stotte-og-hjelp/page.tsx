import { sanityFetch } from "@/sanity/lib/live";
import { STOTTE_OG_HJELP_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import {
  StotteOgHjelpDocument,
  StotteOgHjelpSeksjon,
} from "@/sanity/lib/interfaces/pages";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";
import LinkButton from "@/components/linkButton/LinkButton";
import styles from "./stotteOgHjelp.module.css";

export const revalidate = 86400;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "stotte-og-hjelp";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

const Seksjon = ({ seksjon }: { seksjon?: StotteOgHjelpSeksjon }) => {
  if (!seksjon) return null;
  const { tittel, richText, bilde, lenke, lenker } = seksjon;
  const alleLenker = [...(lenke ? [lenke] : []), ...(lenker ?? [])];
  if (!tittel && !richText && !bilde && alleLenker.length === 0) return null;

  return (
    <section className={styles.seksjon}>
      {bilde?.asset && (
        <div className={styles.seksjonBilde}>
          <SanityNextImage image={bilde} />
        </div>
      )}
      <div className={styles.seksjonTekstWrapper}>
        {tittel && <Text type="h2">{tittel}</Text>}
        {richText && <RichText value={richText} />}
        {alleLenker.length > 0 && (
          <div className={styles.lenker}>
            {alleLenker.map((link, i) => (
              <CustomLink key={link._key ?? i} link={link} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default async function StotteOgHjelpPage() {
  const { data } = await sanityFetch({
    query: STOTTE_OG_HJELP_BY_SLUG_QUERY,
    params: { slug: SLUG },
  });
  const document = data as StotteOgHjelpDocument | null;

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const {
    title,
    ingress,
    heroImage,
    fellesskap,
    likepersoner,
    gaaturer,
    minnehagen,
  } = document;

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <div className={styles.hero}>
        <div className={styles.heroTextWrapper}>
          {title && <Text type="h1">{title}</Text>}
          {ingress && <Text type="bodyLarge">{ingress}</Text>}
        </div>
        {heroImage?.asset && (
          <SanityNextImage image={heroImage} className={styles.heroBilde} />
        )}
      </div>

      <div className={styles.pageContent}>
        <Seksjon seksjon={fellesskap} />
        <section className={styles.seksjon}>
          <div className={styles.seksjonTekstWrapper}>
            {likepersoner?.tittel && (
              <Text type="h2">{likepersoner.tittel}</Text>
            )}
            {likepersoner?.richText && (
              <RichText value={likepersoner.richText} />
            )}
            {likepersoner?.lenke && (
              <div className={styles.lenker}>
                <LinkButton type="secondary" link={likepersoner.lenke} />
              </div>
            )}
          </div>
        </section>
        <section className={styles.seksjon}>
          <div className={styles.seksjonTekstWrapper}>
            {gaaturer?.tittel && <Text type="h2">{gaaturer.tittel}</Text>}
            {gaaturer?.richText && <RichText value={gaaturer.richText} />}
            {gaaturer?.lenker && (
              <div className={styles.lenker}>
                {gaaturer.lenker.map((lenke, i) => (
                  <div key={lenke._key ?? i}>
                    <LinkButton
                      type={i === 0 ? "secondary" : "primary"}
                      link={lenke}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <Seksjon seksjon={minnehagen} />
      </div>
    </div>
  );
}
