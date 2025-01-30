import { defineField } from "sanity";
import { body, richTextID } from "../../fields/text";
import { createAppearance } from "../../fields/appearance";

export const calloutID = "callout";

export const callout = defineField({
  name: calloutID,
  title: "Callout",
  type: "object",
  fields: [
    body,
    createAppearance({
      includeImage: false,
      includeLayout: false,
      includeLink: false,
    }),
  ],
  preview: {
    select: {
      blocks: `${richTextID}[0].value.0.children`,
    },
    prepare(value) {
      const block = value.blocks
        .filter((child: { _type: string }) => child._type === "span")
        .map((span: { text: string }) => span.text)
        .join("");

      return {
        title: block ? block : "No title",
        subtitle: "Callout",
      };
    },
  },
});

export default callout;
