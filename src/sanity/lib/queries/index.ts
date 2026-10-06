/**
 * Central export for all Sanity queries
 */

// Article queries
export {
  ARTICLE_BY_SLUG_QUERY,
  ARTICLES_BY_TYPE_QUERY,
  FEATURED_ARTICLES_QUERY,
  PAGINATED_ARTICLES_QUERY,
  COUNT_ARTICLES_QUERY,
  ARTICLE_SLUGS_QUERY,
  COLLECTION_CATEGORIES_QUERY,
} from './article';

// Page queries
export {
  LANDING_PAGE_QUERY,
} from './page';

// Navigation queries
export {
  NAVIGATION_QUERY,
} from './navigation';

// Settings queries
export {
  ALL_SETTINGS_QUERY,
  SEO_FALLBACK_QUERY,
  BRAND_ASSETS_QUERY,
  COMPANY_INFO_QUERY,
  SOCIAL_MEDIA_QUERY,
} from './settings';

// Event queries
export {
  ALL_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  UPCOMING_EVENTS_QUERY,
  EVENT_SLUGS_QUERY,
} from './event';

// Legal document queries
export {
  LEGAL_DOCUMENT_BY_SLUG_QUERY,
  LEGAL_DOCUMENT_SLUGS_QUERY,
} from './legal';

// Minnehagen queries
export {
  MINNEHAGEN_BY_SLUG_QUERY,
  MINNEHAGEN_SLUGS_QUERY,
} from './minnehagen';

// Støtte og hjelp queries
export {
  STOTTE_OG_HJELP_BY_SLUG_QUERY,
  STOTTE_OG_HJELP_SLUGS_QUERY,
} from './stotteOgHjelp';

// Engasjer deg queries
export {
  ENGASJER_DEG_BY_SLUG_QUERY,
  ENGASJER_DEG_SLUGS_QUERY,
} from './engasjerDeg';

// Aktuelt queries
export {
  AKTUELT_BY_SLUG_QUERY,
  AKTUELT_SLUGS_QUERY,
} from './aktuelt';

// Aktivitet queries
export {
  ALL_AKTIVITETER_QUERY,
  AKTIVITET_BY_ID_QUERY,
  AKTIVITET_ID_TITLE_QUERY,
} from './aktivitet';

// Nettbutikk queries
export {
  NETTBUTIKK_BY_SLUG_QUERY,
  NETTBUTIKK_SLUGS_QUERY,
} from './nettbutikk';

// Bli medlem queries
export {
  BLI_MEDLEM_BY_SLUG_QUERY,
  BLI_MEDLEM_SLUGS_QUERY,
} from './bliMedlem';

// Om foreningen queries
export {
  OM_FORENINGEN_BY_SLUG_QUERY,
  OM_FORENINGEN_SLUGS_QUERY,
} from './omForeningen';

// Blomst queries
export { GODKJENTE_BLOMSTER_QUERY } from './blomst';

// GuriAppen queries
export { GURI_APPEN_QUERY } from './guriAppen';
export { INFORMASJONSDOKUMENT_QUERY } from './informasjon';
