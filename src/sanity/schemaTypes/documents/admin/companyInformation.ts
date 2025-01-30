import { defineType, defineField } from "sanity";

export const companyInfoID = "companyInfo";

const companyInformation = defineType({
  name: companyInfoID,
  type: "document",
  title: "Company Information",
  description:
    "Provide essential company details such as name, contact info, and address.",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Company Name",
      description:
        "The official name of your company or website. This will be displayed on your site.",
      validation: (Rule) => Rule.required().error("Company Name is required"),
    }),
    defineField({
      name: "organizationNumber",
      type: "string",
      title: "Organization Number",
      description:
        "The official organization number or ID registered for your company.",
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Company Phone Number",
      description:
        "The primary contact number for your company. This may be shown on the site.",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Contact Email",
      description:
        "An email address for general inquiries, support, or administrative contact.",
    }),
    defineField({
      name: "address",
      type: "object",
      title: "Company Address",
      description:
        "The physical address of your company. This may appear on your contact or about page.",
      fields: [
        {
          name: "street",
          type: "string",
          title: "Street Address",
          description: "The street and number where your company is located.",
        },
        {
          name: "city",
          type: "string",
          title: "City",
          description: "The city where your company is located.",
        },
        {
          name: "postalCode",
          type: "string",
          title: "Postal Code",
          description: "The postal or zip code for your company's location.",
        },
        {
          name: "country",
          type: "string",
          title: "Country",
          description: "The country where your company is based.",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Company Information",
      };
    },
  },
});

export default companyInformation;
