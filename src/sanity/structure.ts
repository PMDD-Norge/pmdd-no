import type { StructureResolver } from "sanity/structure";
import { StructureBuilder } from "sanity/structure";
import {
  CogIcon,
  UsersIcon,
  DocumentsIcon,
  ControlsIcon,
  ProjectsIcon,
  SearchIcon,
  ImagesIcon,
  ComposeIcon,
  TranslateIcon,
  TagsIcon,
  HighlightIcon,
  CaseIcon,
  ConfettiIcon,
  LinkIcon,
} from "@sanity/icons";
import { companyInfoID } from "./schemaTypes/documents/admin/companyInformation";
import { legalDocumentID } from "./schemaTypes/documents/admin/legalDocument";
import { brandAssetsID } from "./schemaTypes/documents/siteSettings/brandAssets";
import { navigationManagerID } from "./schemaTypes/documents/siteSettings/navigationManager";
import { languageSettingsID } from "./schemaTypes/documents/siteSettings/languageSettings";
import { globalTranslationsID } from "./schemaTypes/documents/siteSettings/globalTranslations";
import { seoFallbackID } from "./schemaTypes/documents/siteSettings/seoFallback";
import { soMeLinksID } from "./schemaTypes/documents/siteSettings/socialMediaProfiles";
import { pageID } from "./schemaTypes/documents/page";
import { informationId } from "./schemaTypes/documents/editorial/information/information";
import { postId } from "./schemaTypes/documents/editorial/information/post";
import { writerID } from "./schemaTypes/documents/editorial/information/writer";
import { categoryID } from "./schemaTypes/documents/editorial/information/category";
import { highlightsId } from "./schemaTypes/documents/editorial/highlights/highlights";
import { eventId } from "./schemaTypes/documents/editorial/highlights/event";
import { availablePositionId } from "./schemaTypes/documents/editorial/highlights/availablePosition";

// Admin section
const adminSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Admin")
    .icon(ControlsIcon)
    .child(
      S.list()
        .title("Admin")
        .items([
          S.listItem()
            .title("Company Information")
            .child(
              S.document()
                .schemaType(companyInfoID)
                .documentId(companyInfoID)
                .title("Company Information")
            ),
          S.listItem()
            .title("Legal Documents")
            .icon(DocumentsIcon)
            .child(
              S.documentTypeList(legalDocumentID).title("Legal Documents")
            ),
        ])
    );

// Site Settings section
const siteSettingsSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Site Settings")
    .icon(CogIcon)
    .child(
      S.list()
        .title("Site Settings")
        .items([
          S.listItem()
            .title("Brand Assets")
            .icon(ImagesIcon)
            .child(
              S.document()
                .schemaType(brandAssetsID)
                .documentId(brandAssetsID)
                .title("Brand Assets")
            ),
          S.listItem()
            .title("Navigation Manager")
            .child(
              S.document()
                .schemaType(navigationManagerID)
                .documentId(navigationManagerID)
                .title("Navigation Manager")
            ),
          S.listItem()
            .title("Languages")
            .icon(TranslateIcon)
            .child(
              S.document()
                .schemaType(languageSettingsID)
                .documentId(languageSettingsID)
                .title("Languages")
            ),
          S.listItem()
            .title("Global Translations")
            .icon(TranslateIcon)
            .child(
              S.document()
                .schemaType(globalTranslationsID)
                .documentId(globalTranslationsID)
                .title("Global Translations")
            ),
          S.listItem()
            .title("Fallback SEO")
            .icon(SearchIcon)
            .child(
              S.document()
                .schemaType(seoFallbackID)
                .documentId(seoFallbackID)
                .title("Fallback SEO")
            ),
          S.listItem()
            .title("Social Media Profiles")
            .icon(UsersIcon)
            .child(
              S.document().schemaType(soMeLinksID).documentId(soMeLinksID)
            ),
          S.listItem()
            .title("Redirects")
            .icon(LinkIcon)
            .child(S.documentTypeList("redirect").title("Redirects")),
        ])
    );

// Dynamic Pages section
const pagesSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Pages")
    .icon(ProjectsIcon)
    .child(S.documentTypeList(pageID).title("Pages"));

// information section with Posts accessible inside information
const editorialSection = (S: StructureBuilder) =>
  S.listItem()
    .title("Editorial") // Editorial & Commerce if Shop is added to the Studio
    .icon(ComposeIcon)
    .child(
      S.list()
        .title("Editorial")
        .items([
          S.listItem()
            .title("Information")
            .icon(ControlsIcon)
            .child(
              S.list()
                .title("Information")
                .items([
                  // information overview (the main information page or settings)
                  S.listItem()
                    .title("Information Main Page")
                    .icon(ControlsIcon)
                    .child(
                      S.document()
                        .schemaType(informationId)
                        .documentId(informationId)
                        .title("Information Main Page")
                    ),
                  // Posts inside the information section
                  S.listItem()
                    .title("Posts")
                    .icon(DocumentsIcon)
                    .child(S.documentTypeList(postId).title("Posts")),
                  // Writers inside the information section
                  S.listItem()
                    .title("Writers")
                    .icon(ComposeIcon)
                    .child(S.documentTypeList(writerID).title("Writers")),
                  // Categories inside the information section
                  S.listItem()
                    .title("Categories")
                    .icon(TagsIcon)
                    .child(S.documentTypeList(categoryID).title("Categories")),
                ])
            ),
          S.listItem()
            .title("Highlights")
            .icon(HighlightIcon)
            .child(
              S.list()
                .title("Highlights")
                .items([
                  // career overview (the main career page or settings)
                  S.listItem()
                    .title("Highlights Main Page")
                    .icon(HighlightIcon)
                    .child(
                      S.document()
                        .schemaType(highlightsId)
                        .documentId(highlightsId)
                        .title("Highlights Main Page")
                    ),
                  // Posts (available positions) inside the career section
                  S.listItem()
                    .title("Events")
                    .icon(ConfettiIcon)
                    .child(S.documentTypeList(eventId).title("Events")),
                  // Posts (available positions) inside the career section
                  S.listItem()
                    .title("Available Positions")
                    .icon(CaseIcon)
                    .child(
                      S.documentTypeList(availablePositionId).title(
                        "Available Positions"
                      )
                    ),
                ])
            ),
        ])
    );

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      adminSection(S),
      siteSettingsSection(S),
      pagesSection(S),
      editorialSection(S),
    ]);
