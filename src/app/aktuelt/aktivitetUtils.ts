import { AktivitetType } from "@/sanity/lib/interfaces/pages";

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
