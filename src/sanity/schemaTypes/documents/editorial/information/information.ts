import { body, title } from "@/sanity/schemaTypes/fields/text";
import contact from "@/sanity/schemaTypes/objects/sections/contact";
import seo from "@/sanity/schemaTypes/objects/seo";
import { defineField, defineType } from "sanity";

export const informationId = "information";

const information = defineType({
  name: informationId,
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
    // pageSlug,
    {
      name: "slug",
      type: "internationalizedArrayString",
    },
    title,
    body,
    {
      ...contact,
      description:
        "Configure the contact section that appears at the bottom of the page. This section can be used to invite user engagement, such as inviting contributors, offering contact options, or presenting collaboration opportunities.",
    },
    defineField({
      name: "allPostsLabel",
      title: "Label for All Posts",
      description:
        "Enter the label used to refer to all posts regardless of their category. This label will be displayed in the filter section on the main information page. Examples include 'news', 'stories', or 'posts'.",
      type: "internationalizedArrayString",
      initialValue: "posts",
      validation: (Rule) => Rule.required(),
    }),
    seo,
  ],
});

export default information;
