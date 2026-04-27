import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "./media";
import { SanityLink } from "./siteSettings";
import { SanityBase } from "./base";
import { Appearance } from "./appearance";

export interface SlugTranslation {
  language: string;
  slug: string;
}

export interface SlugTranslations {
  _translations: (SlugTranslation | null)[];
}

export interface Slug {
  _type: string;
  current: string;
}

export type ThemeType = "primary" | "secondary";

export type SectionObject =
  | HeroObject
  | LogoSaladObject
  | ArticleObject
  | CalloutObject
  | QuoteObject
  | CallToActionObject
  | ResourcesObject
  | ContactObject
  | TestimonialsObject
  | FeaturesObject
  | ImageObject
  | GridObject;

export interface HeroObject extends SanityBase {
  image?: SanityImageData;
  title: string;
  body: string;
  callToActions?: SanityLink[];
}

export interface LogoSaladObject extends SanityBase {
  logos: SanityImageData[];
}

export interface ArticleObject extends SanityBase {
  tag?: string;
  title: string;
  richText?: PortableTextBlock[];
  callToActions?: SanityLink[];
  mediaType?: "image" | "iframe";
  image?: SanityImageData;
  iframeUrl?: string;
  appearance?: Appearance;
}

export interface CalloutObject extends SanityBase {
  richText: PortableTextBlock[];
  appearance?: Appearance;
}

export interface QuoteObject extends SanityBase {
  richText: PortableTextBlock[];
}

export interface CallToActionObject extends SanityBase {
  title?: string;
  richText?: PortableTextBlock[];
  callToActions?: SanityLink[];
  appearance: Appearance;
}

export interface ResourcesObject extends SanityBase {
  title?: string;
  richText?: PortableTextBlock[];
  appearance?: Appearance;
  groupedLinks: {
    title?: string;
    links: SanityLink[];
  }[];
}

export interface ContactObject extends SanityBase {
  title?: string;
  richText?: PortableTextBlock[];
  callToActions?: SanityLink[];
  appearance: Appearance;
}

export interface TestimonialsObject extends SanityBase {
  title: string;
  richText: PortableTextBlock[];
  link: SanityLink;
  list: {
    _type: string;
    _key: string;
    image: SanityImageData;
    name: string;
    company: string;
    richText: PortableTextBlock[];
  }[];
}

export interface FeaturesObject extends SanityBase {
  title: string;
  richText: PortableTextBlock[];
  link: SanityLink;
  appearance: Appearance;
  list: {
    _type: string;
    _key: string;
    title: string;
    richText: PortableTextBlock[];
  }[];
}

export interface ImageObject extends SanityBase {
  title: string;
  image: SanityImageData;
}

export interface GridItem extends SanityBase {
  title: string;
  richText?: PortableTextBlock[] | null;
  lead?: string;
  image?: SanityImageData;
  link?: SanityLink;
}

export interface GridList extends SanityBase {
  title: string;
  columns?: 3 | 4;
  contentType?: "manual" | "event" | "availablePosition" | "post" | "blog-post" | "news" | "job-position" | "resource" | "writer" | "walking-tour" | "turvenn";
  items?: GridItem[];
  maxItems?: number;
  internalLink?: SanityLink;
  ctaLink?: SanityLink;
}

export interface WalkingTourDocument extends SanityBase {
  title: string;
  dateTime?: string;
  location?: string;
  description?: string;
  wheelchairFriendly?: boolean;
  strollerFriendly?: boolean;
  bringFood?: boolean;
  facebookUrl?: string;
  turvenn?: {
    name: string;
    city?: string;
    image?: SanityImageData;
  };
}

export interface TurVennDocument extends SanityBase {
  name: string;
  city?: string;
  image?: SanityImageData;
}

export interface GridObject extends SanityBase {
  title: string;
  richText?: PortableTextBlock[] | null;
  appearance?: Appearance;
  lists: GridList[];
}

export interface SectionGroupObject extends SanityBase {
  title?: string;
  appearance?: Appearance;
  sections: SectionObject[];
}

export type Section =
  | HeroObject
  | LogoSaladObject
  | ArticleObject
  | CalloutObject
  | CallToActionObject
  | SectionGroupObject;

export interface PageDocument extends SanityBase {
  page: string;
  sections: Section[];
  slug: Slug;
}

export interface SeoObject {
  title: string;
  description: string;
  imageUrl?: string;
  keywords?: string;
}

export type Category = {
  _id: string;
  _type: string;
  name: string;
};

export interface HightlightsDocument extends SanityBase {
  page: string;
  slug: Slug;
  title: string;
  richText: PortableTextBlock[];
  availablePositionsSection: {
    title: string;
    richText: PortableTextBlock[];
  };
  eventsSection: {
    title: string;
    richText: PortableTextBlock[];
  };
}

export interface InformationDocument extends SanityBase {
  page: string;
  slug: Slug;
  allPostsLabel: string;
  categories: Category[];
  title: string;
  richText: PortableTextBlock[];
  contactSection: ContactObject;
}

export interface PostDocument extends SanityBase {
  slug: Slug;
  title: string;
  categories: Category[];
  richText: PortableTextBlock[];
  lead: string;
  image: SanityImageData;
  date: string;
  author: Writer;
}

export interface Writer extends SanityBase {
  name: string;
  image: ImageObject;
  occupation: string;
}

export interface EventDocument extends SanityBase {
  title: string;
  richText?: PortableTextBlock[] | null;
  body?: PortableTextBlock[] | null;
  image: SanityImageData;
  link?: SanityLink;
  slug?: Slug;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface AvailablePositionDocument extends SanityBase {
  slug: Slug;
  tag?: string;
  title: string;
  richText: PortableTextBlock[];
  lead: string;
}

export interface VippsBeloep {
  beloep: number;
  etikett?: string;
}

export interface VippsDonasjoner {
  aktivert: boolean;
  tittel?: string;
  beskrivelse?: string;
  vippsNummer?: string;
  innsamlingslenke?: string;
  forslagteBeloep?: VippsBeloep[];
  takkeTekst?: string;
}

export interface MinnehagenDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  richText?: PortableTextBlock[];
  heroImage?: SanityImageData;
  callToAction?: SanityLink;
  vippsDonasjoner?: VippsDonasjoner;
}
