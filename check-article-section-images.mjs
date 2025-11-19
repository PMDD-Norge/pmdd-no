import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== CHECKING ARTICLE SECTION IMAGES ===\n');

const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  "articleSections": sections[_type == "articleSection"]{
    _type,
    _key,
    tag,
    title,
    richText,
    mediaType,
    image{
      asset->{
        _id,
        url,
        originalFilename
      },
      altText,
      hotspot,
      crop,
      title,
      description,
      credits
    },
    iframeUrl,
    appearance{
      theme,
      linkType,
      layout{
        imagePosition
      },
      image{
        asset->{
          _id,
          url,
          originalFilename
        },
        altText,
        hotspot,
        crop,
        title,
        description,
        credits,
        imageAlignment
      }
    }
  }
}`);

const pagesWithArticles = pages.filter(p => p.articleSections && p.articleSections.length > 0);

console.log(`Found ${pagesWithArticles.length} pages with article sections\n`);

pagesWithArticles.forEach(page => {
  console.log(`\n${page.pageName || 'Unnamed'}:`);
  page.articleSections.forEach((article, idx) => {
    console.log(`\n  Article ${idx + 1}: ${article.title || 'No title'}`);
    console.log(`    Media Type: ${article.mediaType || 'Not set'}`);

    // Check main image
    if (article.image) {
      if (article.image.asset) {
        console.log(`    ✓ Main Image: ${article.image.asset.originalFilename || 'Unnamed'}`);
        console.log(`      URL: ${article.image.asset.url}`);
        console.log(`      Alt: ${article.altText || 'No alt text'}`);
      } else {
        console.log(`    ✗ Main image asset is NULL`);
      }
    } else {
      console.log(`    - No main image defined`);
    }

    // Check appearance image
    if (article.appearance?.image) {
      if (article.appearance.image.asset) {
        console.log(`    ✓ Appearance Image: ${article.appearance.image.asset.originalFilename || 'Unnamed'}`);
        console.log(`      URL: ${article.appearance.image.asset.url}`);
      } else {
        console.log(`    ✗ Appearance image asset is NULL`);
      }
    } else {
      console.log(`    - No appearance image defined`);
    }

    // Check iframe
    if (article.iframeUrl) {
      console.log(`    ℹ Iframe URL: ${article.iframeUrl}`);
    }
  });
});

// Also check what the query actually returns
console.log('\n\n=== CHECKING WHAT PAGE QUERY RETURNS ===\n');

const pageBySlug = await client.fetch(`
*[_type == "page" && slug.current == $slug][0] {
  _id,
  pageName,
  slug,
  sections[]{
    _type,
    _key,
    theme,
    _type == "articleSection" => {
      tag,
      title,
      richText,
      callToActions[]{
        _type,
        title,
        type
      },
      mediaType,
      image{
        asset->,
        altText,
        hotspot,
        crop,
        title,
        description,
        credits
      },
      iframeUrl,
      appearance{
        theme,
        linkType,
        layout{
          imagePosition
        },
        image{
          asset->,
          altText,
          hotspot,
          crop,
          title,
          description,
          credits,
          imageAlignment
        }
      }
    }
  }
}
`, { slug: 'bidra' });

console.log('Page "Bidra" article sections:');
console.log(JSON.stringify(pageBySlug.sections.filter(s => s._type === 'articleSection'), null, 2));
