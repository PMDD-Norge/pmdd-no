import { defineField, defineType } from "sanity";

export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "fromPath",
      title: "From Path",
      type: "string",
      description: "The old URL path (e.g., /old-page or /informasjon-om-pmdd)",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.startsWith("/")) {
            return "Path must start with /";
          }
          return true;
        }),
    }),
    defineField({
      name: "toPath",
      title: "To Path",
      type: "string",
      description: "The new URL path to redirect to (e.g., /new-page)",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.startsWith("/")) {
            return "Path must start with /";
          }
          return true;
        }),
    }),
    defineField({
      name: "redirectType",
      title: "Redirect Type",
      type: "string",
      options: {
        list: [
          { title: "301 Permanent", value: "301" },
          { title: "302 Temporary", value: "302" },
        ],
        layout: "radio",
      },
      initialValue: "301",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Enable or disable this redirect",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional description of why this redirect exists",
    }),
  ],
  preview: {
    select: {
      fromPath: "fromPath",
      toPath: "toPath",
      redirectType: "redirectType",
      isActive: "isActive",
    },
    prepare({ fromPath, toPath, redirectType, isActive }) {
      return {
        title: `${fromPath} → ${toPath}`,
        subtitle: `${redirectType} ${isActive ? "✓ Active" : "✗ Inactive"}`,
      };
    },
  },
});