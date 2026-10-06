"use client";

import { useState } from "react";
import { AktivitetMedSlug, AktivitetType } from "@/sanity/lib/interfaces/pages";
import { TYPE_LABELS, formatDato } from "./aktivitetUtils";
import styles from "./aktuelt.module.css";
import Text from "@/components/text/Text";
import FilterTabs from "@/components/filterTabs/FilterTabs";
import CustomLink from "@/components/link/CustomLink";
import { truncateText } from "@/utils/textUtils";
import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";

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

const AktivitetListe = ({
  aktiviteter,
  alleTyperLabel,
}: {
  aktiviteter: AktivitetMedSlug[];
  alleTyperLabel: string;
}) => {
  const [valgtType, setValgtType] = useState<AktivitetType | "alle">("alle");

  const typerITreff = Array.from(
    new Set(aktiviteter.map((aktivitet) => aktivitet.type)),
  );

  const synligeAktiviteter =
    valgtType === "alle"
      ? aktiviteter
      : aktiviteter.filter((aktivitet) => aktivitet.type === valgtType);

  return (
    <>
      {typerITreff.length > 1 && (
        <FilterTabs
          title="Filtrer etter type"
          items={[
            { id: "alle", label: alleTyperLabel },
            ...typerITreff.map((type) => ({
              id: type,
              label: TYPE_LABELS[type],
            })),
          ]}
          selectedId={valgtType}
          onSelect={(id) => setValgtType(id as AktivitetType | "alle")}
        />
      )}
      <ul className={styles.liste}>
        {synligeAktiviteter.map((aktivitet) => {
          const dato = formatDato(aktivitet.detaljer?.dato);
          return (
            <li key={aktivitet._id} className={styles.kort}>
              <div className={styles.kortTekstWrapper}>
                <Text type="h4" as="h3">
                  {aktivitet.title}
                </Text>
                {dato && <Text>{dato}</Text>}
                {aktivitet.ingress && (
                  <Text>{truncateText(aktivitet.ingress, 200)}</Text>
                )}
              </div>
              <CustomLink link={tilDetaljlenke(aktivitet)} />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AktivitetListe;
