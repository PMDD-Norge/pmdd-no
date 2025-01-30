import { defineField } from "sanity";
import { body, richTextID } from "../../fields/text";

export const quoteID = "quote";

export const quote = defineField({
  name: quoteID,
  title: "Quote",
  type: "object",
  fields: [body],
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
        subtitle: "Quote",
      };
    },
  },
});

export default quoteID;
