import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== CHECKING ALL SECTION TYPES IN SANITY ===\n');

// Get all pages with their sections
const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  "sections": sections[]{
    _type,
    _key
  }
}`);

// Count section types
const sectionTypeCounts = {};
pages.forEach(page => {
  if (page.sections && page.sections.length > 0) {
    page.sections.forEach(section => {
      const type = section._type;
      if (type) {
        sectionTypeCounts[type] = (sectionTypeCounts[type] || 0) + 1;
      }
    });
  }
});

console.log('Section types found in Sanity:');
console.log('================================');
Object.entries(sectionTypeCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`${type}: ${count} instances`);
  });

console.log('\n\n=== PAGES BY SECTION TYPE ===\n');

// Show which pages use which section types
Object.keys(sectionTypeCounts).sort().forEach(sectionType => {
  const pagesWithSection = pages.filter(page =>
    page.sections && page.sections.some(s => s._type === sectionType)
  );

  console.log(`\n${sectionType} (${pagesWithSection.length} pages):`);
  pagesWithSection.forEach(page => {
    console.log(`  - ${page.pageName || 'Unnamed'} (${page._id})`);
  });
});

// Check for sections without proper type
console.log('\n\n=== CHECKING FOR INVALID SECTIONS ===\n');
const pagesWithInvalidSections = pages.filter(page =>
  page.sections && page.sections.some(s => !s._type)
);

if (pagesWithInvalidSections.length > 0) {
  console.log('Pages with sections missing _type:');
  pagesWithInvalidSections.forEach(page => {
    console.log(`  - ${page.pageName || 'Unnamed'} (${page._id})`);
    const invalidSections = page.sections.filter(s => !s._type);
    console.log(`    Invalid sections: ${invalidSections.length}`);
  });
} else {
  console.log('✓ All sections have valid _type fields');
}
