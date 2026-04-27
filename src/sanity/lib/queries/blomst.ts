export const GODKJENTE_BLOMSTER_QUERY = `
*[_type == "blomst" && godkjent == true] | order(plantetDato desc) {
  _id,
  blomstType,
  tilMinneOm,
  hilsen,
  navn,
  plantetDato
}
`;
