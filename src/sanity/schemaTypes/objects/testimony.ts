import { body } from "../fields/text";
import image from "../fields/media";

export const testimony = {
  name: "testimony",
  type: "object",
  title: "Testimony",
  fields: [
    body,
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "company",
      type: "string",
      title: "Company or Organization",
    },
    image,
  ],
};

export default testimony;
