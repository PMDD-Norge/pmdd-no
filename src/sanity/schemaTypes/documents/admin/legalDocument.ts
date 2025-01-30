import { defineType } from "sanity";
import { body, title } from "../../fields/text";

export const legalDocumentID = "legalDocument";

const legalDocument = defineType({
  name: legalDocumentID,
  type: "document",
  title: "Legal Document",
  fields: [
    title,
    {
      name: "slug",
      type: "internationalizedArrayString",
    },
    body,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title[0].value,
      };
    },
  },
});

export default legalDocument;
