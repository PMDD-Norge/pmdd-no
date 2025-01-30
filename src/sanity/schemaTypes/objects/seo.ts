import { defineField } from "sanity";

const seo = defineField({
  name: "seo",
  type: "object",
  title: "SEO & Social Media",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      title: "SEO & Social Media Title",
      description: `Create an engaging title that attracts users on social media and in search results. Keep the title between 15-70 characters for the best results. Make sure it is relevant to your content, incorporates natural keywords, and is compelling to the reader. A good title can help improve your SEO and boost click-through rates.`,
    }),
    defineField({
      name: "description",
      type: "internationalizedArrayString",
      title: "SEO & Social Media Description",
      description: `An optional but recommended short description to boost visitor engagement from social media and search engines. Try to keep it between 70-160 characters. A description of at least 70 characters has a higher chance of converting visitors. Keep it concise but descriptive, ensuring it clearly represents your content. Descriptions longer than 160 characters may lose focus and affect engagement.`,
    }),
    defineField({
      name: "keywords",
      type: "internationalizedArrayString",
      title: "SEO & Social Media Keywords",
      description: `Enter targeted keywords to enhance your content’s visibility in search engines and social media platforms. Choose relevant and specific keywords that describe your content. Avoid keyword stuffing—use keywords naturally and focus on what your audience is searching for. This will help improve SEO performance and attract the right visitors.`,
    }),
    defineField({
      name: "image",
      title: "Social Media Image",
      type: "image",
      description: `A compelling image for social media can greatly improve conversion rates, even though it doesn't directly affect SEO. Make sure the image is high-quality and optimized for social media platforms. The recommended size for sharing is 1200x630px, which ensures the image displays well across different platforms and devices.`,
    }),
  ],
});

export default seo;
