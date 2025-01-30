import { defineType, defineField } from "sanity";

export const globalTranslationsID = "globalTranslations";

const globalTranslations = defineType({
  name: globalTranslationsID,
  title: "Label Group",
  type: "document",
  fields: [
    defineField({
      name: "labels",
      title: "Labels",
      description:
        "Strings of text that are used throughout the website and require translation",
      type: "array",
      of: [
        defineField({
          name: "label",
          type: "object",
          fields: [
            defineField({
              name: "labelKey",
              title: "Key",
              type: "string",
              description:
                "This will be used to identify the label in the code. It should be unique and contain only lowercase letters and hyphens (-)",
              validation: (Rule) =>
                Rule.required()
                  .regex(/^[a-z\-]+$/, {
                    name: "lowercase-and-hyphen",
                    invert: false,
                  })
                  .error(
                    "The key should contain only lowercase letters and hyphens (-)"
                  ),
            }),
            defineField({
              name: "text",
              type: "internationalizedArrayString",
            }),
          ],
          preview: {
            select: {
              text: "text",
              subtitle: "key",
            },
            prepare({ text, subtitle }) {
              return {
                title: text[0].value || "Missing translation",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Labels",
      };
    },
  },
});

export default globalTranslations;
