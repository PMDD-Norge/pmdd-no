import { PortableTextBlock } from "next-sanity";
import { SanityBase } from "./base";
import { SanityImageData } from "./media";
import { SocialMediaLink } from "./socialMedia";

interface Reference {
  _ref: string;
  _type?: string;
}

// Extended reference that can include expanded data from queries
export interface ExpandedReference extends Reference {
  slug?: {
    current: string;
  };
  title?: string;
}

export interface Navigation {
  _id: string;
  main: {
    links: SanityLink[];
    callToActionField: SanityLink[];
  };
  sidebar?: {
    links: SanityLink[];
    callToActionField: SanityLink[];
  };
  footer?: FooterSection[];
}

export interface SanityLink extends SanityBase {
  title: string;
  description?: string;
  type: LinkType;
  internalLink?: ExpandedReference;
  url?: string;
  email?: string;
  phone?: string;
  anchor?: string;
  newTab?: boolean;
  ariaLabel?: string;
}

export interface RichTextObject {
  _type: "richTextObject";
  _key: string;
  richText: PortableTextBlock[];
}

export interface FooterSection extends SanityBase {
  sectionTitle: string;
  sectionType: FooterSectionType;
  linksAndContent?: Array<SanityLink | RichTextObject>;
  socialMediaLinks?: Reference;
  socialMedia?: {
    _id: string;
    _type: string;
    sectionTitle: string;
    profiles: SocialMediaLink[];
  };
}

export enum LinkType {
  Internal = "internal",
  External = "external",
  Email = "email",
  Phone = "phone",
}

export enum FooterSectionType {
  Content = "content",
  SocialMedia = "socialMedia",
}

export interface BrandAssets {
  primaryLogo: SanityImageData;
  secondaryLogo: SanityImageData;
  favicon: SanityImageData;
}
