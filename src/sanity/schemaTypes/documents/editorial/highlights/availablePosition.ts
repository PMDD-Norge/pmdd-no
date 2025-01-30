import { defineField, defineType } from "sanity";
import { body, title } from "../../../fields/text";
import seo from "@/sanity/schemaTypes/objects/seo";

export const availablePositionId = "availablePosition";

const availablePosition = defineType({
  name: availablePositionId,
  type: "document",
  title: "Available Position",
  fields: [
    {
      name: "tag",
      title: "Tag",
      type: "internationalizedArrayString",
    },
    title,
    {
      name: "slug",
      type: "internationalizedArrayString",
    },
    defineField({
      name: "lead",
      type: "internationalizedArrayText",
      title: "Lead",
      description: "Enter the introductory text for the post.",
      validation: (Rule) => Rule.required(),
    }),
    body,
    seo,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title[0].value,
      };
    },
  },
});

export default availablePosition;
