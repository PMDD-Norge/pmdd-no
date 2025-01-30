import { defaultLanguage } from "@/i18n/supportedLanguages";
import LanguageSelector from "@/sanity/components/LanguageSelector";
import { defineType } from "sanity";

export const languageSettingsID = "languageSettings";

const languageSettings = defineType({
  name: languageSettingsID,
  type: "document",
  fields: [
    {
      title: "Languages",
      description:
        "Select the languages you want to support. These will be used for website translation and you can choose a default language for the homepage.",
      name: "languages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "id", type: "string" },
            { name: "default", type: "boolean" },
          ],
        },
      ],
      components: { input: LanguageSelector },
      initialValue: () => [defaultLanguage],
    },
  ],
});

export default languageSettings;
