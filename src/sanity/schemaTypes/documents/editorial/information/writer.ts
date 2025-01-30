import { defineField, defineType } from "sanity";
import image from "../../../fields/media";

export const writerID = "writer";

const writer = defineType({
  name: writerID,
  type: "document",
  title: "Writer",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "occupation",
      title: "Occupation",
      type: "internationalizedArrayString",
    },
    defineField({
      ...image,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "occupation[0].value",
    },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});

export default writer;
