/**
 * Slug fra tittel, regnet ut i GROQ.
 *
 * Informasjonsartikler har ikke lenger slug-felt i Sanity; adressen
 * (/informasjon/<slug>) lages fra tittelen. Logikken ligger i GROQ, slik at
 * alle spørringer som viser eller slår opp en artikkel får samme slug uten at
 * hvert sted må regne den ut selv.
 *
 * Regler: små bokstaver, æ/ø/å → ae/o/a, tegnsetting fjernes, mellomrom → "-",
 * og påfølgende bindestreker slås sammen. To artikler med lik tittel får lik
 * slug, så titlene bør være unike.
 */

const TEGN_TIL_BOKSTAV: [string, string][] = [
  ["æ", "ae"],
  ["ø", "o"],
  ["å", "a"],
  ["é", "e"],
  ["è", "e"],
  ["ö", "o"],
  ["ä", "a"],
  ["ü", "u"],
];

// Skilletegn mellom ord blir "-"
const TEGN_TIL_BINDESTREK = [" ", "/", "–", "—", "&", "+", "%", "#", "|", "=", "*", "@"];

// Tegnsetting fjernes, så en tittel som slutter på ")" eller "?" ikke får
// bindestrek bakerst i slugen
const TEGN_SOM_FJERNES = [
  ",", ".", ":", ";", "!", "?", "(", ")", "'", '\\"', "’", "‘", "“", "”", "«", "»", "…",
];

const erstatt = (uttrykk: string, fra: string, til: string) =>
  `array::join(string::split(${uttrykk}, "${fra}"), "${til}")`;

/** GROQ-uttrykk som gir slug for tittelfeltet `felt`. */
export const tittelSlugUttrykk = (felt = "title") => {
  let uttrykk = `lower(${felt})`;
  TEGN_TIL_BOKSTAV.forEach(([fra, til]) => {
    uttrykk = erstatt(uttrykk, fra, til);
  });
  TEGN_SOM_FJERNES.forEach((tegn) => {
    uttrykk = erstatt(uttrykk, tegn, "");
  });
  TEGN_TIL_BINDESTREK.forEach((tegn) => {
    uttrykk = erstatt(uttrykk, tegn, "-");
  });
  // Slår sammen "--", "---" osv. til én bindestrek
  for (let i = 0; i < 3; i++) {
    uttrykk = erstatt(uttrykk, "--", "-");
  }
  return uttrykk;
};

export const TITTEL_SLUG = tittelSlugUttrykk();

/** Gjelder bare informasjonsartikler; øvrige dokumenter beholder slug-feltet. */
export const MED_TITTEL_SLUG = `_type == "informasjonsartikkel"`;

/**
 * Projeksjon som erstatter `slug` på artikler: informasjonsartikler får slug
 * fra tittelen, andre dokumenter beholder sitt eget slug-felt.
 */
export const SLUG_PROJEKSJON = `"slug": select(${MED_TITTEL_SLUG} => { "current": ${TITTEL_SLUG} }, slug)`;

/** Filter som treffer et dokument på slug, enten fra tittel eller lagret slug. */
export const SLUG_ER = (param = "$slug") =>
  `(slug.current == ${param} || (${MED_TITTEL_SLUG} && ${TITTEL_SLUG} == ${param}))`;
