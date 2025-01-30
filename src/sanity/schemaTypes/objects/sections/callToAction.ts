import { defineField } from "sanity";
import { body, title } from "../../fields/text";
import callToActionField from "../../fields/callToActionFields";
import { appearance } from "../../fields/appearance";

export const callToActionSectionID = "ctaSection";

export const callToAction = defineField({
  name: callToActionSectionID,
  title: "Call to Action",
  type: "object",
  fields: [
    {
      ...title,
      description:
        "This will be the title of the call to action section. Make it engaging to capture the attention of your audience.",
    },
    body,
    {
      name: "callToActions",
      title: "Call to Actions",
      description:
        "The first Call to Action (CTA) will be styled as a primary link button.",
      type: "array",
      of: [
        {
          type: "object",
          fields: callToActionField.fields,
          preview: callToActionField.preview,
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    appearance,
  ],
  preview: {
    select: {
      title: "title",
      media: "appearance.image",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title[0].value || "Missing title",
        subtitle: "Call to Action",
        media,
      };
    },
  },
});

export default callToAction;
