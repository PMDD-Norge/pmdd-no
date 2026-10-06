/**
 * GROQ queries for navigation and footer
 */

import { SLUG_PROJEKSJON } from "./slugs";

// Get full navigation including footer
export const NAVIGATION_QUERY = `
*[_type == "navigationManager"][0] {
  _id,
  "main": {
    "links": mainMenu[_type == "link"]{
      _key,
      title,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        ${SLUG_PROJEKSJON}
      },
      url,
      email,
      phone,
      anchor,
      newTab
    },
    "callToActionField": mainMenu[_type == "callToActionField"]{
      _key,
      title,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        ${SLUG_PROJEKSJON}
      },
      url,
      email,
      phone,
      anchor,
      newTab
    }
  },
  "sidebar": {
    "links": sidebarMenu[_type == "link"]{
      _key,
      title,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        ${SLUG_PROJEKSJON}
      },
      url,
      email,
      phone,
      anchor,
      newTab
    },
    "callToActionField": sidebarMenu[_type == "callToActionField"]{
      _key,
      title,
      type,
      "internalLink": internalLink->{
        _type,
        title,
        ${SLUG_PROJEKSJON}
      },
      url,
      email,
      phone,
      anchor,
      newTab
    }
  },
  "footer": footerSections[]{
    _key,
    sectionTitle,
    sectionType,
    sectionType == "content" => {
      linksAndContent[]{
        _type,
        _key,
        _type == "link" => {
          title,
          type,
          "internalLink": internalLink->{
            _type,
            title,
            ${SLUG_PROJEKSJON}
          },
          url,
          email,
          phone,
          anchor,
          newTab
        },
        _type == "richTextObject" => {
          richText
        }
      }
    },
    sectionType == "socialMedia" => {
      "socialMedia": socialMediaLinks->{
        _id,
        _type,
        sectionTitle,
        "profiles": soMeLinkArray[]{
          _key,
          "platform": socialMediaPlatform,
          "url": socialMediaUrl
        }
      }
    }
  }
}
`;
