import { defineField } from "sanity";
import { body, title } from "../../fields/text";
import callToActionField from "../../fields/callToActionFields";
import { createAppearance } from "../../fields/appearance";

export const contactSectionID = "contactSection";

export const contact = defineField({
  name: contactSectionID,
  title: "Contact Us",
  type: "object",
  fields: [
    {
      ...title,
      description:
        "This will be the title of the Contact Us section. Make it engaging to capture the attention of your audience.",
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
    createAppearance({ includeImage: false, includeLayout: false }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title[0].value || "Missing title",
        subtitle: "Contact Us",
      };
    },
  },
});

export default contact;
