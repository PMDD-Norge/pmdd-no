import { defineField } from "sanity";
import { link } from "../objects/link";

export const callToActionFieldID = "callToActionField";

const callToActionField = defineField({
  name: callToActionFieldID,
  title: "Call to Action",
  type: "object",
  fields: [...link.fields],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title[0].value,
        subtitle: "Call to Action",
      };
    },
  },
});
export default callToActionField;
