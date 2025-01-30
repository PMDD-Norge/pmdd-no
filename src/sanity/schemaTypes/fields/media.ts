import { defineField, ValidationContext } from "sanity";

export enum ImageAlignment {
  Left = "left",
  Right = "right",
}

export enum ImageSize {
  Large = "large",
  Small = "small",
}

interface ImageParent {
  asset?: {
    _ref: string;
    _type: string;
  };
}

export const meta = [
  defineField({
    name: "title",
    title: "Image Title",
    type: "internationalizedArrayString",
    description: "The title of the image, often displayed as a tooltip.",
  }),
  defineField({
    name: "description",
    title: "Image Description",
    type: "internationalizedArrayString",
    description:
      "A more detailed explanation of the image for context and storytelling (e.g., 'A golden retriever joyfully running through a grassy park under a sunny sky'). Enhances user understanding and experience.",
  }),
  defineField({
    name: "altText",
    title: "Alternative Text",
    type: "internationalizedArrayString",
    description:
      "A brief, concise description of the image for accessibility and SEO (e.g., 'Golden retriever holding a stick'). Used by screen readers and as a fallback if the image doesn't load.",
    hidden: ({ parent }) => !parent?.asset,
    validation: (Rule) =>
      Rule.custom((value, context: ValidationContext) => {
        // Need to type assert here since parent is unknown
        const parent = context.parent as ImageParent | undefined;
        const hasImage = parent?.asset;

        if (hasImage && !value) {
          return "Alt text is required when an image is present";
        }
        return true;
      }),
  }),
  defineField({
    name: "credits",
    title: "Credits",
    type: "internationalizedArrayString",
    description:
      "Attribution for the image (e.g., 'Photo by John Doe on Unsplash'). Useful for copyright or acknowledgment purposes.",
  }),
];

const image = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true, collapsible: true, collapsed: false },
  fields: [...meta],
});

export default image;
