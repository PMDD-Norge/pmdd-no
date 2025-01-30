import { defineField } from "sanity";
import { body, title } from "../../fields/text";
import { link } from "../link";
import feature from "../feature";
import { createAppearance } from "../../fields/appearance";

export const featuresID = "features";

export const features = defineField({
  name: featuresID,
  title: "Features",
  type: "object",
  fields: [
    title,
    body,
    {
      name: "list",
      title: "List of Features",
      type: "array",
      of: [feature],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error("You must have between 1 and 3 feature."),
    },
    link,
    createAppearance({ includeLayout: false }),
  ],
  preview: {
    select: {
      title: "title",
      media: "appearance.image",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title[0].value,
        subtitle: "Features",
        media,
      };
    },
  },
});

export default features;
