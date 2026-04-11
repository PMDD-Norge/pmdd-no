import { defineLive } from "next-sanity";
import { client } from "./client";
import { token } from "./token";
import { apiVersion } from "../env";

const { sanityFetch: _sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion }),
  browserToken: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  serverToken: token,
  fetchOptions: {
    revalidate: 60,
  },
});

// In development, always include drafts so unpublished content is visible locally
const sanityFetch: typeof _sanityFetch = process.env.NODE_ENV === "development"
  ? (args) => _sanityFetch({ ...args, perspective: "previewDrafts" } as Parameters<typeof _sanityFetch>[0])
  : _sanityFetch;

export { sanityFetch, SanityLive };
