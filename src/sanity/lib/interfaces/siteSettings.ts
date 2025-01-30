import { PortableTextBlock } from "sanity";
import { SanityBase } from "./base";
import { SanityImageData } from "./media";

interface Reference {
  _ref: string;
  _type?: string;
}

export interface Navigation {
  _id: string;
  main: SanityLink[];
  sidebar?: SanityLink[];
  footer?: FooterSection[];
}

export interface SanityLink extends SanityBase {
  title: string;
  description?: string;
  type: LinkType;
  internalLink?: Reference;
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
