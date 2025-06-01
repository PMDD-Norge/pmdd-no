import { defineField, Rule } from "sanity";
import AnchorSelect from "../../components/AnchorSelect";
import LinkTypeSelector from "../../components/LinkTypeSelector";
import NewTabSelector from "../../components/NewTabSelector";

export const linkID = "link";
export const linkWithDescriptionId = "linkWithDescription";

enum LinkType {
  Internal = "internal",
  External = "external",
  Email = "email",
  Phone = "phone",
}

interface Parent {
  title: Array<{ value: string }>;
  type?: LinkType;
  internalLink?: { reference: { _ref: string } };
}

const getLazyTypes = () => ({
  page: "page",
  information: "information",
  legalDocument: "legalDocument",
  highlights: "highlights",
  availablePosition: "availablePosition",
  post: "post",
});

// // Email validation regex with better pattern matching
// const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// // Phone validation regex that allows international formats
// const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

const baseLinkSchema = defineField({
  name: linkID,
  title: "Link",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Provide a link title",
      type: "internationalizedArrayString",
      description: "Enter the link text that will be displayed on the website.",
    },
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      description: "Optional description text for the link",
      validation: (Rule) => Rule.optional(),
    }),
    {
      name: "type",
      title: "What type of link is this?",
      description:
        "Select the type of link you want to create. Based on what you select, different fields will appear for you to fill in",
      type: "string",
      components: {
        input: LinkTypeSelector,
      },
      // TODO: check validation after translation
      // validation: (Rule) =>
      //   Rule.custom((value, context) => {
      //     const parent = context.parent as Parent;
      //     if (parent?.title[0] && !value) {
      //       return "Link type is required";
      //     }
      //     return true;
      //   }),
    },
    {
      name: "internalLink",
      title: "Internal Link",
      description:
        "Search for a page by title and select the page you want to link to",
      type: "reference",
      to: [
        { type: getLazyTypes().page },
        { type: getLazyTypes().information },
        { type: getLazyTypes().legalDocument },
        { type: getLazyTypes().highlights },
        { type: getLazyTypes().availablePosition },
        { type: getLazyTypes().post },
      ],
      options: {
        disableNew: true,
      },
      validation: (Rule: Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as Parent;
          if (parent?.title && parent?.type === LinkType.Internal && !value) {
            return "Link to page is required";
          }
          return true;
        }),
      hidden: ({ parent }: { parent: Parent }) =>
        parent?.type !== LinkType.Internal,
    },
    {
      name: "url",
      title: "Enter an external link",
      type: "url",
      description:
        "Enter the full URL for the external link, including 'https://'. For example, 'https://www.example.com'.",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }).custom((value, context) => {
          const parent = context.parent as Parent;
          if (parent?.title && parent?.type === LinkType.External && !value) {
            return "URL is required for external links";
          }
          return true;
        }),
      hidden: ({ parent }) => parent?.type !== LinkType.External,
    },
    {
      name: "email",
      title: "Enter the email address",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value: string, context) => {
          const parent = context.parent as Parent;
          if (parent?.title && parent?.type === LinkType.Email && !value) {
            return "Must have a valid email address";
          }
          if (value && !/^\S+@\S+\.\S+$/.test(value)) {
            return "Must be a valid email address";
          }
          return true;
        }),
      hidden: ({ parent }) => parent?.type !== LinkType.Email,
    },
    {
      name: "phone",
      title: "Enter the phone number",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value: string, context) => {
          const parent = context.parent as Parent;
          if (parent?.title && parent?.type === LinkType.Phone && !value) {
            return "Must have a valid phone number";
          }
          if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
            return "Must be a valid phone number";
          }
          return true;
        }),
      hidden: ({ parent }) => parent?.type !== LinkType.Phone,
    },
    {
      name: "anchor",
      title: "Do you want to link to a specific section on the page?",
      type: "string",
      components: {
        input: AnchorSelect,
      },
      description:
        "Specify a section on the selected internal page to link directly to that section.",
      hidden: ({ parent }) =>
        parent?.type !== LinkType.Internal || !parent?.internalLink,
    },
    {
      name: "newTab",
      title: "Should this link open in a new tab?",
      description:
        "Enable this option to open the link in a new browser tab. This can be useful for keeping the current page open.",
      type: "boolean",
      components: {
        input: NewTabSelector,
      },
      initialValue: false,
      hidden: ({ parent }) =>
        [LinkType.Email, LinkType.Phone].includes(parent?.type),
    },
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
    },
    prepare(selection) {
      const { title, type } = selection;
      return {
        title: title?.[0]?.value || "Missing title",
        subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) : "",
      };
    },
  },
});

// Standard link without description
export const link = defineField({
  ...baseLinkSchema,
  name: linkID,
  fields: baseLinkSchema.fields.filter((field) => field.name !== "description"),
});

// Link variant with description field
export const linkWithDescription = defineField({
  ...baseLinkSchema,
  name: "linkWithDescription",
});
