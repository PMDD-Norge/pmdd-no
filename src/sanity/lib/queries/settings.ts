/**
 * GROQ queries for site settings
 */

// Get all settings in one query
export const ALL_SETTINGS_QUERY = `
{
  "seo": *[_type == "seoFallback"][0].seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  },
  "brandAssets": *[_type == "brandAssets"][0]{
    _id,
    primaryLogo{asset->, altText, hotspot},
    secondaryLogo{asset->, altText, hotspot},
    favicon{asset->}
  },
  "companyInfo": *[_type == "companyInformation"][0]{
    _id,
    organizationName,
    organizationNumber,
    address,
    email,
    phone
  },
  "socialMedia": *[_type == "socialMediaProfiles"][0]{
    _id,
    profiles[]{
      _key,
      platform,
      url
    }
  }
}
`;

// Get SEO fallback
export const SEO_FALLBACK_QUERY = `
*[_type == "seoFallback"][0].seo{
  metaTitle,
  metaDescription,
  openGraphImage{asset->},
  noIndex
}
`;

// Get brand assets
export const BRAND_ASSETS_QUERY = `
*[_type == "brandAssets"][0]{
  _id,
  primaryLogo{asset->, altText, hotspot},
  secondaryLogo{asset->, altText, hotspot},
  favicon{asset->}
}
`;

// Get company information
export const COMPANY_INFO_QUERY = `
*[_type == "companyInformation"][0]{
  _id,
  organizationName,
  organizationNumber,
  address,
  email,
  phone
}
`;

// Get social media profiles
export const SOCIAL_MEDIA_QUERY = `
*[_type == "socialMediaProfiles"][0]{
  _id,
  profiles[]{
    _key,
    platform,
    url
  }
}
`;
