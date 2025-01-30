// hero.ts
import { defineField } from "sanity";
import callToActionField from "../../fields/callToActionFields";
import CustomCallToActions from "../../../components/CustomCallToActions";
import { title } from "../../fields/text";
import image from "../../fields/media";
export const heroID = "hero";

export const hero = defineField({
  name: heroID,
  title: "Hero Section",
  type: "object",
  fields: [
    title,
    {
      name: "body",
      title: "Body",
      type: "internationalizedArrayString",
    },
    image,
    {
      name: "callToActions",
      title: "Call to Actions",
      description:
        "Available only for landing pages, this feature helps improve user engagement by directing them to important areas or actions on your site. The first Call to Action (CTA) will be styled as a primary link button.",
      type: "array",
      of: [
        {
          type: "object",
          fields: callToActionField.fields,
          preview: callToActionField.preview,
        },
      ],
      validation: (Rule) =>
        Rule.custom((callToActions) => {
          if (!Array.isArray(callToActions)) return true;
          if (callToActions.length > 2) {
            return "You can only have two Call to Action links";
          }
          return true;
        }),
      components: {
        input: CustomCallToActions,
      },
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title[0].value,
        subtitle: "Hero Section",
        media,
      };
    },
  },
});

export default hero;
