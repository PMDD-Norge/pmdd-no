import Text from "@/components/text/Text";
import CustomLink from "@/components/link/CustomLink";
import { AktivitetMedSlug } from "@/sanity/lib/interfaces/pages";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { formatDato } from "@/utils/aktivitetUtils";
import { truncateText } from "@/utils/textUtils";
import styles from "./aktivitetKort.module.css";

const tilDetaljlenke = (aktivitet: AktivitetMedSlug): SanityLink => ({
  _key: aktivitet._id ?? "",
  _type: "link",
  title: "Les mer",
  type: LinkType.Internal,
  ariaLabel: `Les mer om ${aktivitet.title}`,
  internalLink: {
    _ref: `/aktuelt/${aktivitet.slug}`,
    _type: "aktivitet",
  },
});

/**
 * Innholdet i et aktivitetskort: tittel, dato og tid, ingress og «Les mer».
 * Brukes både i oversikten på /aktuelt og i innholdsgrid, så aktiviteter ser
 * like ut overalt. Pakkes inn i en <li> av den som bruker det.
 */
const AktivitetKort = ({ aktivitet }: { aktivitet: AktivitetMedSlug }) => {
  const dato = formatDato(aktivitet.detaljer?.dato);
  return (
    <>
      <div className={styles.tekst}>
        <Text type="h4" as="h3">
          {aktivitet.title}
        </Text>
        {dato && <Text>{dato}</Text>}
        {aktivitet.ingress && (
          <Text>{truncateText(aktivitet.ingress, 200)}</Text>
        )}
      </div>
      <CustomLink link={tilDetaljlenke(aktivitet)} />
    </>
  );
};

export default AktivitetKort;
