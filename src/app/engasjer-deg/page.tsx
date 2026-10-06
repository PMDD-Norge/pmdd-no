import { sanityFetch } from "@/sanity/lib/live";
import {
  ENGASJER_DEG_BY_SLUG_QUERY,
  PAGINATED_ARTICLES_QUERY,
} from "@/sanity/lib/queries";
import { PAGINATION } from "@/constants";
import {
  EngasjerDegDocument,
  EngasjerDegSeksjon,
} from "@/sanity/lib/interfaces/pages";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { generatePageMetadata } from "@/utils/metadata";
import { truncateText } from "@/utils/textUtils";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import LinkButton from "@/components/linkButton/LinkButton";
import CustomLink from "@/components/link/CustomLink";
import styles from "./engasjerDeg.module.css";

export const revalidate = 86400;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "engasjer-deg";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

interface LedigVervArtikkel {
  _id: string;
  title: string;
  lead?: string;
  slug: { current: string };
}

const tilStillingslenke = (stilling: LedigVervArtikkel): SanityLink => ({
  _key: stilling._id,
  _type: "link",
  title: "Les mer",
  type: LinkType.Internal,
  internalLink: {
    _ref: stilling._id,
    _type: "article",
    slug: stilling.slug,
  },
});

const Seksjon = ({ seksjon }: { seksjon?: EngasjerDegSeksjon }) => {
  if (!seksjon) return null;
  const { tittel, richText, lenke, lenker } = seksjon;
  const alleLenker = [...(lenke ? [lenke] : []), ...(lenker ?? [])];
  if (!tittel && !richText && alleLenker.length === 0) return null;

  return (
    <section className={styles.seksjon}>
      <div className={styles.seksjonTekstWrapper}>
        {tittel && <Text type="h2">{tittel}</Text>}
        {richText && <RichText value={richText} />}
        {alleLenker.length > 0 && (
          <div className={styles.lenker}>
            {alleLenker.map((link, i) => (
              <LinkButton type="secondary" key={link._key ?? i} link={link} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const LedigeVerv = ({
  seksjon,
  stillinger,
}: {
  seksjon?: EngasjerDegDocument["ledigeVerv"];
  stillinger: LedigVervArtikkel[];
}) => {
  if (!seksjon && stillinger.length === 0) return null;
  const { tittel, richText, callToAction } = seksjon ?? {};

  return (
    <section className={styles.seksjon}>
      <div className={styles.seksjonTekstWrapper}>
        <div className={styles.stillingSeksjonText}>
          {tittel && <Text type="h2">{tittel}</Text>}
          {richText && <RichText value={richText} />}
          {stillinger.length > 0 && (
            <ul className={styles.stillinger}>
              {stillinger.map((stilling) => (
                <li key={stilling._id} className={styles.stilling}>
                  <div className={styles.stillingTextWrapper}>
                    <Text type="h4" as="h3">
                      {stilling.title}
                    </Text>
                    {stilling.lead && (
                      <Text>{truncateText(stilling.lead, 200)}</Text>
                    )}
                  </div>
                  <CustomLink link={tilStillingslenke(stilling)} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {callToAction?.title && (
          <div className={styles.cta}>
            {callToAction.description && (
              <Text>{callToAction.description}</Text>
            )}
            <CustomLink link={callToAction} />
          </div>
        )}
      </div>
    </section>
  );
};

export default async function EngasjerDegPage() {
  const [{ data }, { data: stillingerData }] = await Promise.all([
    sanityFetch({
      query: ENGASJER_DEG_BY_SLUG_QUERY,
      params: { slug: SLUG },
    }),
    sanityFetch({
      query: PAGINATED_ARTICLES_QUERY,
      params: {
        type: "job-position",
        start: 0,
        end: PAGINATION.MAX_JOB_POSITIONS,
        category: null,
      },
    }),
  ]);
  const document = data as EngasjerDegDocument | null;
  const stillinger = (stillingerData || []) as LedigVervArtikkel[];

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const { title, ingress, heroImage, likepersoner, turvenner, ledigeVerv } =
    document;

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
      <Seksjon seksjon={likepersoner} />
      <Seksjon seksjon={turvenner} />
      <LedigeVerv seksjon={ledigeVerv} stillinger={stillinger} />
    </div>
  );
}
