import { defineField, defineType } from "sanity";
import { body, title } from "../../../fields/text";
import { categoryID } from "./category";
import seo from "@/sanity/schemaTypes/objects/seo";

export const postId = "post";

const posts = defineType({
  name: postId,
  type: "document",
  title: "Post",
  fields: [
    title,
    // titleSlug,
    {
      name: "slug",
      type: "internationalizedArrayString",
    },
    // defineField({
    //   name: "date",
    //   title: "Publish Date",
    //   description: "Select the date and time when this post will be published.",
    //   type: "datetime",
    //   initialValue: () => new Date().toISOString(),
    //   validation: (Rule) =>
    //     Rule.required().custom((date, context) => {
    //       // Ensure date is not undefined or null
    //       if (!date) return "The publish date is required.";

    //       const selectedDate = new Date(date);
    //       const createdAt = new Date(context.document?._createdAt as string);
    //       const now = new Date();

    //       // Add a small buffer of 1 second (1000 milliseconds)
    //       const buffer = 1000;

    //       // Check if the selected date is older than today
    //       if (selectedDate.getTime() < now.getTime() - buffer) {
    //         // If the date is older than today, it cannot be older than _createdAt
    //         if (selectedDate.getTime() < createdAt.getTime()) {
    //           return "The publish date cannot be older than the creation date.";
    //         }
    //       }

    //       return true;
    //     }),
    // }),
    defineField({
      name: "categories",
      title: "Categories",
      description:
        "Select or create categories for this post to help organize your content.",
      type: "array",
      of: [
        defineField({
          name: "categoryRef",
          type: "reference",
          to: [{ type: categoryID }],
        }),
      ],
    }),
    // defineField({
    //   name: "author",
    //   title: "Author",
    //   description:
    //     "Select the writer of this post. The author provides attribution and helps readers connect with the content creator.",
    //   type: "reference",
    //   to: [{ type: writerID }],
    // }),
    defineField({
      name: "lead",
      type: "internationalizedArrayText",
      title: "Lead",
      description: "Enter the introductory text for the post.",
      validation: (Rule) => Rule.required(),
    }),
    // defineField({
    //   ...image,
    //   description: "Upload a featured image for the post.",
    //   validation: (Rule) => Rule.required(),
    // }),
    body,
    seo,
  ],
  preview: {
    select: {
      title: "title",
      categories: "categories",
    },
    prepare({ title, categories }) {
      const categoryCount = categories?.length || 0;
      return {
        title: title[0].value,
        subtitle: categoryCount
          ? `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`
          : "No categories",
      };
    },
  },
});

export default posts;
