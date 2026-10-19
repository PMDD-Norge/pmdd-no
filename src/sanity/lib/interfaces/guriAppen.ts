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

export interface GuriAppenForDegSomPunkt {
  _key: string;
  tittel: string;
  beskrivelse?: string;
}

export interface GuriAppenForDegSom {
  tittel?: string;
  punkter?: GuriAppenForDegSomPunkt[];
}

export interface GuriAppenDocument extends SanityBase {
  title: string;
  ingress?: string;
  heroImage?: SanityImageData;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  forDegSom?: GuriAppenForDegSom;
  about?: PortableTextBlock[];
  argumentsTitle?: string;
  arguments?: GuriAppenArgument[];
  footerSection?: GuriAppenFooterSection;
}
