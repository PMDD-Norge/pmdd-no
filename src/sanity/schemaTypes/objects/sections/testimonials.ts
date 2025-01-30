import { defineField } from "sanity";
import { body, title } from "../../fields/text";
import testimony from "../testimony";
import { link } from "../link";

export const testimonialsID = "testimonials";

export const testimonals = defineField({
  name: testimonialsID,
  title: "Testimonials",
  type: "object",
  fields: [
    title,
    body,
    link,
    {
      name: "list",
      title: "List of Testimonials",
      type: "array",
      of: [testimony],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(4)
          .error("You must have between 1 and 4 testimonials."),
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title[0].value,
        subtitle: "Testimonials",
      };
    },
  },
});

export default testimonals;
