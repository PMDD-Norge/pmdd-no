import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== CHECKING HERO IMAGES ===\n');

// Get all pages with hero sections
const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  slug,
  "heroSections": sections[_type == "hero"]{
    _type,
    _key,
    title,
    subtitle,
    body,
    image{
      asset->{
        _id,
        url,
        originalFilename
      },
      altText,
      hotspot,
      title,
      description
    },
    callToActions[]{
      title
    },
    imagePosition
  }
}`);

const pagesWithHero = pages.filter(p => p.heroSections && p.heroSections.length > 0);

console.log(`Found ${pagesWithHero.length} pages with hero sections\n`);

pagesWithHero.forEach(page => {
  console.log(`\n${page.pageName || 'Unnamed'} (${page.slug?.current || 'no slug'}):`);
  page.heroSections.forEach((hero, idx) => {
    console.log(`\n  Hero ${idx + 1}: ${hero.title || 'No title'}`);

    if (hero.image) {
      if (hero.image.asset) {
        console.log(`    ✓ Image: ${hero.image.asset.originalFilename || 'Unnamed'}`);
        console.log(`      URL: ${hero.image.asset.url}`);
        console.log(`      Alt: ${hero.image.altText || 'No alt text'}`);
      } else {
        console.log(`    ✗ Image asset is NULL`);
        console.log(`    Image object:`, JSON.stringify(hero.image, null, 2));
      }
    } else {
      console.log(`    - No image defined (image is null/undefined)`);
    }
  });
});

// Also check what the actual query from page.ts returns
console.log('\n\n=== CHECKING PAGE QUERY FOR HERO ===\n');

const homePage = await client.fetch(`
*[_type == "page" && slug.current == $slug][0] {
  _id,
  pageName,
  slug,
  sections[]{
    _type,
    _key,
    theme,
    _type == "hero" => {
      title,
      subtitle,
      body,
      image{asset->, altText, hotspot, title, description},
      callToActions[]{
        title
      },
      imagePosition
    }
  }
}
`, { slug: 'hjem' });

console.log('Home page hero sections:');
const heroSections = homePage?.sections?.filter(s => s._type === 'hero');
if (heroSections && heroSections.length > 0) {
  heroSections.forEach((hero, idx) => {
    console.log(`\nHero ${idx + 1}:`);
    console.log(`  Title: ${hero.title}`);
    console.log(`  Image:`, hero.image ? JSON.stringify(hero.image, null, 2) : 'null');
  });
} else {
  console.log('No hero sections found');
}
