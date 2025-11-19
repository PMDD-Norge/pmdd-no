import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== CHECKING GRID SECTION IMAGES ===\n');

// Get all pages with grid sections with full details
const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  "gridSections": sections[_type == "grid"]{
    _type,
    _key,
    title,
    richText,
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
    },
    lists[]{
      _key,
      title,
      contentType,
      maxItems,
      contentType == "manual" => {
        items[]{
          _key,
          title,
          richText,
          image{
            asset->{
              _id,
              url,
              originalFilename
            },
            altText,
            hotspot
          }
        }
      }
    }
  }
}`);

const pagesWithGrids = pages.filter(p => p.gridSections && p.gridSections.length > 0);

console.log(`Found ${pagesWithGrids.length} pages with grid sections\n`);

pagesWithGrids.forEach(page => {
  console.log(`\n${page.pageName || 'Unnamed'}:`);
  page.gridSections.forEach((grid, idx) => {
    console.log(`\n  Grid ${idx + 1}: ${grid.title || 'No title'}`);

    // Check appearance image
    if (grid.appearance?.image) {
      if (grid.appearance.image.asset) {
        console.log(`    ✓ Appearance Image: ${grid.appearance.image.asset.originalFilename || 'Unnamed'}`);
        console.log(`      URL: ${grid.appearance.image.asset.url}`);
      } else {
        console.log(`    ✗ Appearance image asset is NULL`);
      }
    } else {
      console.log(`    - No appearance image defined`);
    }

    // Check list items
    if (grid.lists && grid.lists.length > 0) {
      grid.lists.forEach((list, listIdx) => {
        console.log(`\n    List ${listIdx + 1}: ${list.title || 'No title'} (${list.contentType})`);

        if (list.contentType === 'manual' && list.items) {
          list.items.forEach((item, itemIdx) => {
            console.log(`      Item ${itemIdx + 1}: ${item.title || 'No title'}`);
            if (item.image) {
              if (item.image.asset) {
                console.log(`        ✓ Image: ${item.image.asset.originalFilename || 'Unnamed'}`);
              } else {
                console.log(`        ✗ Image asset is NULL`);
              }
            } else {
              console.log(`        - No image defined`);
            }
          });
        }
      });
    } else {
      console.log(`    - No lists defined`);
    }
  });
});
