/**
 * Overordnede sider for undersider, brukt i brødsmulestien.
 * Adressene må samsvare med de faste rutene under src/app.
 */
export interface BreadcrumbItem {
  label: string;
  /** Utelates for siste ledd (siden man er på) */
  href?: string;
}

export const OVERORDNEDE_SIDER = {
  informasjon: { label: "Informasjon", href: "/informasjon" },
  aktuelt: { label: "Aktuelt", href: "/aktuelt" },
  engasjerDeg: { label: "Engasjer deg", href: "/engasjer-deg" },
  omForeningen: { label: "Om foreningen", href: "/om-foreningen" },
  nettbutikk: { label: "Nettbutikk", href: "/nettbutikk" },
} as const satisfies Record<string, BreadcrumbItem>;

/** Overordnet side for en artikkel, ut fra dokumenttype og artikkeltype. */
export function overordnetForArtikkel(
  documentType?: string,
  articleType?: string,
): BreadcrumbItem {
  if (documentType === "informasjonsartikkel") return OVERORDNEDE_SIDER.informasjon;
  if (articleType === "job-position") return OVERORDNEDE_SIDER.engasjerDeg;
  if (articleType === "news") return OVERORDNEDE_SIDER.aktuelt;
  return OVERORDNEDE_SIDER.informasjon;
}
