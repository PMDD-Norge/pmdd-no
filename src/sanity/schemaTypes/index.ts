import { SchemaTypeDefinition } from "sanity";
import navigationManager from "./documents/siteSettings/navigationManager";
import socialMediaLinks from "./documents/siteSettings/socialMediaProfiles";
import page from "./documents/page";
import { link, linkWithDescription } from "./objects/link";
import { socialMedia } from "./objects/socialMedia";
import { footerSection } from "./objects/footerSection";
import callToActionField from "./fields/callToActionFields";
import information from "./documents/editorial/information/information";
import posts from "./documents/editorial/information/post";
import categories from "./fields/categories";
import legalDocument from "./documents/admin/legalDocument";
import seoFallback from "./documents/siteSettings/seoFallback";
import companyInformation from "./documents/admin/companyInformation";
import brandAssets from "./documents/siteSettings/brandAssets";
import languageSettings from "./documents/siteSettings/languageSettings";
import { richText } from "./fields/text";
import globalTranslations from "./documents/siteSettings/globalTranslations";
import writer from "./documents/editorial/information/writer";
import { category } from "./documents/editorial/information/category";
import { appearance, colorTheme } from "./fields/appearance";
import { groupedResources } from "./objects/sections/resources";
import highlights from "./documents/editorial/highlights/highlights";
import availablePosition from "./documents/editorial/highlights/availablePosition";
import event from "./documents/editorial/highlights/event";
import redirect from "./documents/siteSettings/redirect";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    navigationManager,
    socialMediaLinks,
    page,
    link,
    socialMedia,
    footerSection,
    callToActionField,
    information,
    posts,
    categories,
    legalDocument,
    seoFallback,
    companyInformation,
    brandAssets,
    languageSettings,
    richText,
    globalTranslations,
    writer,
    category,
    appearance,
    colorTheme,
    linkWithDescription,
    groupedResources,
    highlights,
    availablePosition,
    event,
    redirect,
  ],
};
