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
  infoMessage?: {
    tittel?: string;
    tekst?: PortableTextBlock[];
  };
}

export interface LogoSaladObject extends SanityBase {
  logos: SanityImageData[];
}

export interface ArticleObject extends SanityBase {
  tag?: string;
  title?: string;
  tittelNivaa?: "h2" | "h3";
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
  kolonnerMobil?: 1 | 2;
  contentType?: "manual" | "event" | "availablePosition" | "post" | "blog-post" | "news" | "job-position" | "resource" | "writer" | "writer-styret" | "writer-raadgivere" | "writer-frivillige" | "writer-turvenn" | "walking-tour" | "turvenn" | "activities" | "aktivitet" | "aktivitet-gaatur" | "aktivitet-kurs" | "aktivitet-event" | "aktivitet-fritekst";
  items?: GridItem[];
  maxItems?: number;
  internalLink?: SanityLink;
  ctaLink?: SanityLink;
  bunnTekst?: PortableTextBlock[];
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
  tittelNivaa?: "h2" | "h3";
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
  slug?: Slug;
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
  infoMessage?: {
    tittel?: string;
    tekst?: PortableTextBlock[];
  };
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

export interface StotteOgHjelpSeksjon {
  tittel?: string;
  richText?: PortableTextBlock[];
  lenker?: SanityLink[];
  lenke?: SanityLink;
  bilde?: SanityImageData;
}

export interface StotteOgHjelpDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  ingress?: string;
  heroImage?: SanityImageData;
  fellesskap?: StotteOgHjelpSeksjon;
  likepersoner?: StotteOgHjelpSeksjon;
  gaaturer?: StotteOgHjelpSeksjon;
  minnehagen?: StotteOgHjelpSeksjon;
}

export interface EngasjerDegSeksjon {
  tittel?: string;
  richText?: PortableTextBlock[];
  lenker?: SanityLink[];
  lenke?: SanityLink;
}

export interface EngasjerDegLedigeVerv {
  tittel?: string;
  richText?: PortableTextBlock[];
  callToAction?: SanityLink;
}

export interface EngasjerDegDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  ingress?: string;
  heroImage?: SanityImageData;
  likepersoner?: EngasjerDegSeksjon;
  turvenner?: EngasjerDegSeksjon;
  ledigeVerv?: EngasjerDegLedigeVerv;
}

export type AktivitetType = "gaatur" | "kurs" | "event" | "fritekst";

export interface AktivitetPerson {
  _id: string;
  name: string;
  city?: string;
  gruppe?: string;
  occupation?: string;
  image?: SanityImageData;
}

export interface AktivitetDocument extends SanityBase {
  type: AktivitetType;
  title: string;
  ingress?: string;
  detaljer?: {
    dato?: string;
    tid?: string;
    sted?: string;
    pris?: string;
    lenke?: SanityLink;
    wheelchairFriendly?: boolean;
    strollerFriendly?: boolean;
    bringFood?: boolean;
  };
  involverte?: {
    tittel?: string;
    personer?: AktivitetPerson[];
  };
}

export interface AktueltDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  ingress?: string;
  alleTyperLabel?: string;
  cta?: {
    tittel?: string;
    richText?: PortableTextBlock[];
    lenke?: SanityLink;
  };
}

export interface NettbutikkDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  richText?: PortableTextBlock[];
}

export interface BliMedlemSeksjon {
  tittel?: string;
  richText?: PortableTextBlock[];
  lenke?: SanityLink;
  iframeUrl?: string;
}

export interface BliMedlemDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  ingress?: string;
  heroImage?: SanityImageData;
  betydningAvMedlemskap?: BliMedlemSeksjon;
  medlemskapstyper?: BliMedlemSeksjon;
  andreMaaterAaBidraPaa?: BliMedlemSeksjon;
}

export interface OmForeningenPerson {
  _id: string;
  name: string;
  occupation?: string;
  email?: string;
  image?: SanityImageData;
}

export interface OmForeningenPersonSeksjon {
  _key: string;
  tittel?: string;
  body?: PortableTextBlock[];
  folk?: OmForeningenPerson[];
}

export interface OmForeningenOppfordring {
  tittel?: string;
  richText?: PortableTextBlock[];
  lenker?: SanityLink[];
}

export interface OmForeningenStyrendeDokument {
  _id: string;
  title: string;
  slug: Slug;
}

export interface OmForeningenDocument extends SanityBase {
  pageName: string;
  slug: Slug;
  title?: string;
  ingress?: string;
  richText?: PortableTextBlock[];
  heroImage?: SanityImageData;
  organisasjonenVaar?: {
    tittel?: string;
    richText?: PortableTextBlock[];
    seksjoner?: OmForeningenPersonSeksjon[];
    oppfordring?: OmForeningenOppfordring;
  };
  styrendeDokumenter?: {
    tittel?: string;
    richText?: PortableTextBlock[];
    dokumenter?: OmForeningenStyrendeDokument[];
  };
}
