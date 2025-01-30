import { defineField } from "sanity";
import image from "../../fields/media";

export const logoSaladID = "logoSalad";

export const logoSalad = defineField({
  name: logoSaladID,
  title: "Logo Salad",
  type: "object",
  fields: [
    {
      name: "logos",
      title: "List of Logos",
      description:
        "Add a list of logos to display. You must include between 6 and 12 logos.",
      type: "array",
      of: [image],
      validation: (Rule) =>
        Rule.min(6)
          .error("At least 6 logos are required.")
          .max(12)
          .error("You can add up to 12 logos.")
          .required()
          .error("The list of logos is required."),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Logo Salad",
      };
    },
  },
});

export default logoSalad;
