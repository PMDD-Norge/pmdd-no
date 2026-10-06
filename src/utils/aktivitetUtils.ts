import { AktivitetType } from "@/sanity/lib/interfaces/pages";

interface MedDetaljer {
  detaljer?: { dato?: string; tid?: string };
}

export const TYPE_LABELS: Record<AktivitetType, string> = {
  gaatur: "Gåtur",
  kurs: "Kurs",
  event: "Event",
  fritekst: "Annet",
};

// Overskrift over personene som er knyttet til aktiviteten, når Sanity ikke
// har satt en egen tittel.
export const INVOLVERTE_TITTEL: Record<AktivitetType, string> = {
  gaatur: "Arrangeres av",
  kurs: "Kursholdere",
  event: "Deltakere",
  fritekst: "Involverte",
};

export const formatDato = (dato?: string) => {
  if (!dato) return null;
  return new Date(dato).toLocaleDateString("nb-NO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Oslo",
  });
};

// Dagens dato (ÅÅÅÅ-MM-DD) i norsk tid. Aktiviteter er "kommende" til og med
// dagen de holdes.
const idagOslo = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });

const sorteringsnokkel = ({ detaljer }: MedDetaljer) =>
  `${detaljer?.dato ?? "9999-12-31"} ${detaljer?.tid ?? ""}`;

/**
 * Fjerner aktiviteter med utløpt dato og sorterer på dato og klokkeslett.
 * Aktiviteter uten dato vises alltid og havner sist.
 */
export const kommendeAktiviteter = <T extends MedDetaljer>(
  aktiviteter: T[],
): T[] => {
  const idag = idagOslo();
  return aktiviteter
    .filter(({ detaljer }) => !detaljer?.dato || detaljer.dato >= idag)
    .sort((a, b) => sorteringsnokkel(a).localeCompare(sorteringsnokkel(b)));
};
