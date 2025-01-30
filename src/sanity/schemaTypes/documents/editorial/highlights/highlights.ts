import { body, title } from "@/sanity/schemaTypes/fields/text";
import seo from "@/sanity/schemaTypes/objects/seo";
import { defineField, defineType } from "sanity";

export const highlightsId = "highlights";

const highlights = defineType({
  name: highlightsId,
  type: "document",
  fields: [
    defineField({
      name: "page",
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
    title,
    body,
    {
      name: "eventsSection",
      title: "Section for events",
      type: "object",
      fields: [title, body],
    },
    {
      name: "availablePositionsSection",
      title: "Section for available positions",
      type: "object",
      fields: [title, body],
    },
    seo,
  ],
});

export default highlights;
