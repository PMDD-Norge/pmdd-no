import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const token =
  process.env.NODE_ENV === "development"
    ? process.env.SANITY_API_TOKEN_DEV
    : process.env.SANITY_API_TOKEN_PROD;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  perspective: "published",
  useCdn: false,
  stega: {
    enabled: false, // Studio is now in separate repo
  },
});
