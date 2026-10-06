import { sanityFetch } from "@/sanity/lib/live";
import { AKTIVITET_ID_TITLE_QUERY } from "@/sanity/lib/queries";

/**
 * Aktiviteter har ikke slug-felt i Sanity; adressen (/aktuelt/<slug>) lages
 * fra tittelen. To aktiviteter med samme tittel får slugen utvidet med de
 * siste tegnene i dokument-ID-en, så adressene er entydige.
 */

export const slugifyTittel = (tittel: string): string =>
  tittel
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

interface MedIdOgTittel {
  _id: string;
  title: string;
}

/** Slug for hver aktivitet, nøklet på dokument-ID. Må regnes ut over alle aktivitetene. */
export const lagAktivitetSlugs = (
  aktiviteter: MedIdOgTittel[],
): Map<string, string> => {
  const baser = aktiviteter.map((a) => slugifyTittel(a.title) || "aktivitet");
  const antall = new Map<string, number>();
  baser.forEach((b) => antall.set(b, (antall.get(b) ?? 0) + 1));

  return new Map(
    aktiviteter.map((a, i) => [
      a._id,
      antall.get(baser[i])! > 1 ? `${baser[i]}-${a._id.slice(-6)}` : baser[i],
    ]),
  );
};

/**
 * Legger på slug (se lagAktivitetSlugs) på aktiviteter hentet fra en
 * delmengde, f.eks. en grid som bare viser gåturer. Slugen regnes ut over alle
 * aktivitetene, så den blir den samme som på /aktuelt.
 */
export const medAktivitetSlugs = async <T extends { _id?: string }>(
  aktiviteter: T[],
): Promise<(T & { slug: string })[]> => {
  const { data } = await sanityFetch({
    query: AKTIVITET_ID_TITLE_QUERY,
    params: {},
  });
  const slugs = lagAktivitetSlugs((data || []) as MedIdOgTittel[]);
  return aktiviteter.map((a) => ({ ...a, slug: slugs.get(a._id ?? "") ?? "" }));
};
