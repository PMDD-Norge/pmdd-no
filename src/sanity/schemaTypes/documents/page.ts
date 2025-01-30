import { defineField, defineType } from "sanity";

import seo from "../objects/seo";
import hero from "../objects/sections/hero";
import article from "../objects/sections/article";
import logoSalad from "../objects/sections/logoSalad";
import callout from "../objects/sections/callout";
import callToAction from "../objects/sections/callToAction";
import testimonals from "../objects/sections/testimonials";
import imageSection from "../objects/sections/image";
import grid from "../objects/sections/grid";
import { quote } from "../objects/sections/quote";
import features from "../objects/sections/features";
import contact from "../objects/sections/contact";
import resources from "../objects/sections/resources";

export const pageID = "page";

const page = defineType({
  name: pageID,
  type: "document",
  title: "Pages",
  fields: [
    defineField({
      name: "pageName",
      title: "Page name",
      description:
        "Enter a distinctive name for the page to help content editors easily identify and manage it. This name is used internally and is not visible on your website.",
      type: "string",
      validation: (Rule) => Rule.required().max(30),
    }),
    {
      name: "slug",
      type: "internationalizedArrayString",
    },
    seo,
    defineField({
      name: "sections",
      title: "Sections",
      description: "Add sections here",
      type: "array",
      of: [
        hero,
        logoSalad,
        article,
        callout,
        quote,
        callToAction,
        testimonals,
        imageSection,
        grid,
        features,
        contact,
        resources,
      ],
    }),
  ],
  preview: {
    select: {
      title: "pageName",
      urlSlug: "slug.current",
    },
    prepare({ title, urlSlug }) {
      return {
        title: title,
        subtitle: urlSlug,
      };
    },
  },
});

export default page;
