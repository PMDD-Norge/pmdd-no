import { soMeLinksID } from "@/sanity/schemaTypes/documents/siteSettings/socialMediaProfiles";
import { SanityBase } from "./base";

// Define the SocialMediaLink interface based on the expected structure
export interface SocialMediaLink extends SanityBase {
  url: string;
  platform: string;
}

// Define the SocialMediaProfiles interface based on the document schema
export interface SocialMediaProfiles {
  _id: string;
  _type: typeof soMeLinksID;
  sectionTitle: string;
  soMeLinkArray: SocialMediaLink[];
}
