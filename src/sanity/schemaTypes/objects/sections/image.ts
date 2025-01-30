import { defineField } from "sanity";
import { title } from "../../fields/text";
import image from "../../fields/media";

export const imageID = "imageSection";

export const imageSection = defineField({
  name: imageID,
  title: "Image",
  type: "object",
  fields: [
    title,
    defineField({
      ...image,
      description: "Upload a featured image for the section.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title[0].value,
        subtitle: "Image",
      };
    },
  },
});

export default imageSection;
