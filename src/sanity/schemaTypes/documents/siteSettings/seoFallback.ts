import { defineType } from "sanity";
import seo from "../../objects/seo";

export const seoFallbackID = "seoFallback";

const seoFallback = defineType({
  name: seoFallbackID,
  type: "document",
  title: "Default SEO Settings",
  description:
    "If page-specific SEO settings are not provided, these settings will be applied as default.",
  fields: seo.fields,
  preview: {
    prepare() {
      return {
        title: "SEO Configurations",
      };
    },
  },
});

export default seoFallback;
