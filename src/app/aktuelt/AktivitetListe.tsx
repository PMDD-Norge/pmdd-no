"use client";

import { useState } from "react";
import { AktivitetMedSlug, AktivitetType } from "@/sanity/lib/interfaces/pages";
import { TYPE_LABELS } from "@/utils/aktivitetUtils";
import styles from "./aktuelt.module.css";
import AktivitetKort from "@/components/aktivitet/AktivitetKort";
import FilterTabs from "@/components/filterTabs/FilterTabs";

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
        {synligeAktiviteter.map((aktivitet) => (
          <li key={aktivitet._id} className={styles.kort}>
            <AktivitetKort aktivitet={aktivitet} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default AktivitetListe;
