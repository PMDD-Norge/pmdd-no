import { SanityBase } from "./base";

// Local constant definition (schemas removed from frontend)
export const soMeLinksID = "socialMediaProfiles";

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
