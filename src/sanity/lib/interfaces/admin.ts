import { Slug } from "./pages";
import { SanityBase } from "./base";
import { PortableTextBlock } from "sanity";

export interface LegalDocument extends SanityBase {
  title: string;
  slug: Slug;
  richText: PortableTextBlock[];
}

export interface CompanyInfo extends SanityBase {
  name: string;
  organizationNumber: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
