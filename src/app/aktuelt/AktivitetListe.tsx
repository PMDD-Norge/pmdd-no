"use client";

import { useState } from "react";
import { AktivitetMedSlug } from "@/sanity/lib/interfaces/pages";
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
  const [valgtType, setValgtType] = useState<string>("alle");

  // Filtermenyen bygges av typene som faktisk finnes i listen, i den
  // rekkefølgen de først forekommer (aktivitetene er sortert på dato)
  const typerITreff = Array.from(
    new Map(
      aktiviteter.flatMap(({ aktivitetstype }) =>
        aktivitetstype
          ? [[aktivitetstype._id, aktivitetstype.name] as const]
          : [],
      ),
    ),
    ([id, label]) => ({ id, label }),
  );

  const synligeAktiviteter =
    valgtType === "alle"
      ? aktiviteter
      : aktiviteter.filter(
          (aktivitet) => aktivitet.aktivitetstype?._id === valgtType,
        );

  return (
    <>
      {typerITreff.length > 1 && (
        <FilterTabs
          title="Filtrer etter type"
          items={[{ id: "alle", label: alleTyperLabel }, ...typerITreff]}
          selectedId={valgtType}
          onSelect={setValgtType}
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
