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
} from './article';

// Page queries
export {
  PAGE_BY_SLUG_QUERY,
  PAGE_SLUGS_QUERY,
  LANDING_PAGE_ID_QUERY,
} from './page';

// Collection Hub queries
export {
  COLLECTION_HUB_BY_TYPE_QUERY,
  COLLECTION_HUB_WITH_ARTICLES_QUERY,
  COLLECTION_CATEGORIES_QUERY,
} from './collectionHub';

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
