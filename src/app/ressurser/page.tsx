import { sanityFetch } from "@/sanity/lib/live";
import { RESSURSER_QUERY } from "@/sanity/lib/queries";
import {
  RessurserData,
  RessursListeelement,
} from "@/sanity/lib/interfaces/pages";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { generateMetadataFromSeo } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";
import LinkButton from "@/components/linkButton/LinkButton";
import styles from "./ressurser.module.css";

export const revalidate = 86400;

const hentRessurser = async () => {
  const { data } = await sanityFetch({ query: RESSURSER_QUERY, params: {} });
  return data as RessurserData | null;
};

export async function generateMetadata() {
  const data = await hentRessurser();
  return generateMetadataFromSeo(
    data?.side?.seo as Parameters<typeof generateMetadataFromSeo>[0],
  );
}

// Lenker i ressursdokumentet er enten en adresse (full eller intern sti) eller
// en opplastet fil. Fil og eksterne adresser åpnes i ny fane.
const tilLenke = (key: string, title: string, url?: string): SanityLink => ({
  _key: key,
  _type: "link",
  title,
  type: LinkType.External,
  url,
  newTab: !!url && /^https?:\/\//.test(url),
});

const erEkstern = (url: string) => /^https?:\/\//.test(url);

// Hvite kort: tittelen er lenken, kort beskrivelse under
const Kortliste = ({ elementer }: { elementer: RessursListeelement[] }) => (
  <ul className={styles.kortliste}>
    {elementer.map((element) => (
      <li key={element._id} className={styles.kort}>
        <Text type="h4" as="h3">
          {element.link ? (
            <a
              className={styles.kortLenke}
              href={element.link}
              target={erEkstern(element.link) ? "_blank" : undefined}
              rel={erEkstern(element.link) ? "noopener noreferrer" : undefined}
            >
              {element.title}
            </a>
          ) : (
            element.title
          )}
        </Text>
        {element.kortBio && <Text type="small">{element.kortBio}</Text>}
      </li>
    ))}
  </ul>
);

export default async function RessurserPage() {
  const data = await hentRessurser();
  const side = data?.side;

  if (!side) {
    return <PMDDErrorMessage />;
  }

  const verktoy = side.verktoy;
  const verktoylenker = verktoy?.lenker ?? [];
  const materiell = data?.materiell ?? [];
  const retningslinjer = data?.retningslinjer ?? [];
  const artikler = data?.forskningsartikler ?? [];
  const apneArtikler = artikler.filter((artikkel) => !artikkel.laast);
  const laasteArtikler = artikler.filter((artikkel) => artikkel.laast);
  const { artikkelListe, cta } = side;

  return (
    <div className={`sectionWrapperColumn ${styles.pageContainer}`}>
      <div className={styles.hero}>
        {side.title && <Text type="h1">{side.title}</Text>}
        {side.ingress && <Text type="bodyLarge">{side.ingress}</Text>}
        {side.richText && <RichText value={side.richText} />}
      </div>

      {(verktoy?.tittel || verktoylenker.length > 0) && (
        <section className={styles.seksjon}>
          {verktoy?.tittel && <Text type="h2">{verktoy.tittel}</Text>}
          <div className={styles.undergruppe}>
            {verktoy?.undertittelDrsp && (
              <Text type="h3">{verktoy.undertittelDrsp}</Text>
            )}
            {verktoy?.richText && (
              <RichText value={verktoy.richText} paragraphType="small" />
            )}
            {verktoylenker.map((lenke) => (
              <div key={lenke._key} className={styles.verktoylenke}>
                <CustomLink
                  link={tilLenke(
                    lenke._key,
                    lenke.tittel,
                    lenke.filUrl ?? lenke.url,
                  )}
                />
                {lenke.beskrivelse && (
                  <Text type="small">{lenke.beskrivelse}</Text>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {materiell.length > 0 && (
        <section className={styles.seksjon}>
          {side.materiellTittel && (
            <Text type="h2">{side.materiellTittel}</Text>
          )}
          <ul className={styles.materiell}>
            {materiell.map((fil) => {
              const innhold = (
                <>
                  {fil.coverBilde?.asset && (
                    <div className={styles.cover}>
                      <SanityNextImage image={fil.coverBilde} sizes="12rem" />
                    </div>
                  )}
                  <Text type="small" className={styles.materiellTittel}>
                    {fil.tittel}
                  </Text>
                </>
              );
              return (
                <li key={fil._key}>
                  {fil.filUrl ? (
                    <a
                      className={styles.materiellKort}
                      href={fil.filUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Last ned ${fil.tittel}`}
                    >
                      {innhold}
                    </a>
                  ) : (
                    <div className={styles.materiellKort}>{innhold}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {retningslinjer.length > 0 && (
        <section className={styles.seksjon}>
          {side.retningslinjerTittel && (
            <Text type="h2">{side.retningslinjerTittel}</Text>
          )}
          <Kortliste elementer={retningslinjer} />
        </section>
      )}

      {artikler.length > 0 && (
        <section className={styles.seksjon}>
          {artikkelListe?.tittel && (
            <Text type="h2">{artikkelListe.tittel}</Text>
          )}
          {apneArtikler.length > 0 && (
            <div className={styles.undergruppe}>
              {artikkelListe?.undertittelAapne && (
                <Text type="h3">{artikkelListe.undertittelAapne}</Text>
              )}
              <Kortliste elementer={apneArtikler} />
            </div>
          )}
          {laasteArtikler.length > 0 && (
            <div className={styles.undergruppe}>
              {artikkelListe?.undertittelLaaste && (
                <Text type="h3">{artikkelListe.undertittelLaaste}</Text>
              )}
              <Kortliste elementer={laasteArtikler} />
            </div>
          )}
        </section>
      )}

      {cta?.tittel && (
        <section className={styles.seksjon}>
          <Text type="h4" as="h2">
            {cta.tittel}
          </Text>
          {cta.richText && (
            <RichText value={cta.richText} paragraphType="small" />
          )}
          {cta.epost && (
            <LinkButton
              type="secondary"
              link={{
                _key: "cta-epost",
                _type: "link",
                title: "Send oss en e-post",
                type: LinkType.Email,
                email: cta.epost,
              }}
            />
          )}
        </section>
      )}
    </div>
  );
}
