import { sanityFetch } from "@/sanity/lib/live";
import { BLI_MEDLEM_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import {
  BliMedlemDocument,
  BliMedlemSeksjon,
} from "@/sanity/lib/interfaces/pages";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import styles from "./bliMedlem.module.css";
import CustomLink from "@/components/link/CustomLink";

export const revalidate = 86400;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "bli-medlem";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

const Seksjon = ({ seksjon }: { seksjon?: BliMedlemSeksjon }) => {
  if (!seksjon) return null;
  const { tittel, richText, lenke, iframeUrl } = seksjon;
  if (!tittel && !richText && !lenke && !iframeUrl) return null;

  return (
    <section className={styles.seksjon}>
      <div className={styles.seksjonTekstWrapper}>
        {tittel && <Text type="h2">{tittel}</Text>}
        {richText && <RichText value={richText} />}
        {lenke?.title && <CustomLink link={lenke} />}
        {iframeUrl && (
          <div className={styles.iframe}>
            <iframe
              src={iframeUrl}
              title="Innmeldingsskjema"
              className={styles.iframeSkjema}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default async function BliMedlemPage() {
  const { data } = await sanityFetch({
    query: BLI_MEDLEM_BY_SLUG_QUERY,
    params: { slug: SLUG },
  });
  const document = data as BliMedlemDocument | null;

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const {
    title,
    ingress,
    heroImage,
    betydningAvMedlemskap,
    medlemskapstyper,
    andreMaaterAaBidraPaa,
  } = document;

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <div className={styles.hero}>
        <div className={styles.heroTextWrapper}>
          {title && <Text type="h1">{title}</Text>}
          {ingress && <Text type="bodyLarge">{ingress}</Text>}
        </div>
        {heroImage?.asset && (
          <SanityNextImage
            image={heroImage}
            priority
            className={styles.heroBilde}
          />
        )}
      </div>

      <div className={styles.pageContent}>
        <Seksjon seksjon={betydningAvMedlemskap} />
        <section className={styles.medlemskapstyperSeksjon}>
          <div className={styles.medlemskapstyperSeksjonTekst}>
            {medlemskapstyper?.tittel && (
              <Text type="h2">{medlemskapstyper?.tittel}</Text>
            )}
            {medlemskapstyper?.richText && (
              <RichText value={medlemskapstyper?.richText} />
            )}
          </div>
          {medlemskapstyper?.iframeUrl && (
            <div className={styles.iframe}>
              <iframe
                src={medlemskapstyper.iframeUrl}
                title="Innmeldingsskjema"
                className={styles.iframeSkjema}
                loading="lazy"
              />
            </div>
          )}
        </section>
        <Seksjon seksjon={andreMaaterAaBidraPaa} />
      </div>
    </div>
  );
}
