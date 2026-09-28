/**
 * Bygger kanoniske URL-er for Sanity-dokumenter.
 *
 * De fleste dokumenttypene ligger på toppnivå (/<slug>), men artikler på
 * informasjonssiden hører hjemme under seksjonen sin (/informasjon/<slug>).
 * Alle steder som bygger lenker – interne lenker, sitemap og lister – skal
 * bruke denne, slik at samme innhold ikke får to gyldige URL-er.
 */

/** Dokumenttyper som ligger under en seksjon, med tilhørende prefiks. */
const SEKSJONSPREFIKS: Record<string, string> = {
  informasjonsartikkel: "informasjon",
};

/**
 * Returnerer stien til et dokument, uten etterfølgende skråstrek.
 * Slug-en oppgis uten skråstrek foran.
 */
export function getDocumentPath(
  documentType: string | undefined,
  slug: string,
): string {
  if (!slug) return "/";
  if (slug === "/") return "/";

  const prefiks = documentType ? SEKSJONSPREFIKS[documentType] : undefined;
  return prefiks ? `/${prefiks}/${slug}` : `/${slug}`;
}

/** True hvis dokumenttypen ligger under en seksjon i stedet for på toppnivå. */
export function harSeksjonsprefiks(documentType: string | undefined): boolean {
  return Boolean(documentType && SEKSJONSPREFIKS[documentType]);
}

export { SEKSJONSPREFIKS };
