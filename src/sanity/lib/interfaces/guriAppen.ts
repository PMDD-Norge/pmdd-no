import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "./media";
import { SanityBase } from "./base";

export interface GuriAppenArgument {
  _key: string;
  title: string;
  text: PortableTextBlock[];
  image?: SanityImageData;
}

export interface GuriAppenFooterSection {
  text?: PortableTextBlock[];
  image?: SanityImageData;
  screenshots?: SanityImageData[];
}

export interface GuriAppenDocument extends SanityBase {
  title: string;
  ingress?: string;
  heroImage?: SanityImageData;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  about?: PortableTextBlock[];
  argumentsTitle?: string;
  arguments?: GuriAppenArgument[];
  footerSection?: GuriAppenFooterSection;
}
