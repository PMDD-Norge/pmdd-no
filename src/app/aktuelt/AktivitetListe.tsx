"use client";

import { useState } from "react";
import {
  AktivitetDocument,
  AktivitetType,
} from "@/sanity/lib/interfaces/pages";
import styles from "./aktuelt.module.css";
import Text from "@/components/text/Text";
import FilterTabs from "@/components/filterTabs/FilterTabs";
import CustomLink from "@/components/link/CustomLink";

const TYPE_LABELS: Record<AktivitetType, string> = {
  gaatur: "Gåtur",
  kurs: "Kurs",
  event: "Event",
  fritekst: "Annet",
};

const formatDato = (dato?: string) => {
  if (!dato) return null;
  return new Date(dato).toLocaleDateString("nb-NO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Oslo",
  });
};

const AktivitetListe = ({
  aktiviteter,
  alleTyperLabel,
}: {
  aktiviteter: AktivitetDocument[];
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
                {(dato || aktivitet.detaljer?.tid) && (
                  <Text type="small">
                    {[dato, aktivitet.detaljer?.tid]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                )}
                {aktivitet.ingress && <Text>{aktivitet.ingress}</Text>}
              </div>
              {aktivitet.detaljer?.lenke?.title && (
                <CustomLink link={aktivitet.detaljer.lenke} />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AktivitetListe;
