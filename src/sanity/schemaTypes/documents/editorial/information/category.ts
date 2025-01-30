import { defineField } from "sanity";

export const categoryID = "category";

export const category = defineField({
  name: categoryID,
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      description:
        "The name of the category. This will be displayed on the website and used for organizing information posts.",
      type: "internationalizedArrayString",
      initialValue: null,
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title[0].value,
        subtitle: "Category",
      };
    },
  },
});
