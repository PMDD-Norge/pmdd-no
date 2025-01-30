import { defineField } from "sanity";
import { body, title } from "../fields/text";

export const feature = defineField({
  name: "feature",
  type: "object",
  title: "Feature",
  fields: [title, body],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title[0].value,
        subtitle: "Feature",
      };
    },
  },
});

export default feature;
