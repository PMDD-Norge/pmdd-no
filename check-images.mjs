import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== CHECKING IMAGES IN SECTIONS ===\n');

// Get all pages with sections that have images
const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  "sections": sections[]{
    _type,
    _key,

    // Hero images
    _type == "hero" => {
      "image": image{
        asset->{_id, url},
        altText,
        title
      }
    },

    // Grid appearance images
    _type == "grid" => {
      "appearanceImage": appearance.image{
        asset->{_id, url},
        altText,
        title
      }
    },

    // Article section images
    _type == "articleSection" => {
      "image": image{
        asset->{_id, url},
        altText,
        title
      },
      "appearanceImage": appearance.image{
        asset->{_id, url},
        altText,
        title
      }
    },

    // CTA images
    _type == "ctaSection" => {
      "appearanceImage": appearance.image{
        asset->{_id, url},
        altText,
        title
      }
    },

    // Callout images
    _type == "callout" => {
      "appearanceImage": appearance.image{
        asset->{_id, url},
        altText,
        title
      }
    }
  }
}`);

pages.forEach(page => {
  console.log(`\n${page.pageName || 'Unnamed'}:`);
  if (!page.sections || page.sections.length === 0) {
    console.log('  No sections');
    return;
  }

  page.sections.forEach((section, idx) => {
    console.log(`  [${idx}] ${section._type}`);

    if (section.image) {
      if (section.image.asset) {
        console.log(`    ✓ Image: ${section.image.asset._id}`);
        console.log(`      URL: ${section.image.asset.url}`);
        if (section.image.altText) console.log(`      Alt: ${section.image.altText}`);
      } else {
        console.log(`    ✗ Image asset missing`);
      }
    }

    if (section.appearanceImage) {
      if (section.appearanceImage.asset) {
        console.log(`    ✓ Appearance Image: ${section.appearanceImage.asset._id}`);
        console.log(`      URL: ${section.appearanceImage.asset.url}`);
      } else {
        console.log(`    ✗ Appearance image asset missing`);
      }
    }
  });
});

console.log('\n\n=== CHECKING IMAGE ASSETS ===\n');
const imageAssets = await client.fetch(`*[_type == "sanity.imageAsset"][0...5]{
  _id,
  url,
  originalFilename
}`);

console.log(`Found ${imageAssets.length} image assets (showing first 5):`);
imageAssets.forEach(img => {
  console.log(`  - ${img.originalFilename || 'Unnamed'}`);
  console.log(`    ID: ${img._id}`);
  console.log(`    URL: ${img.url}`);
});
