/**
 * Sjekker full page data slik frontend ser det
 */

const sanityClient = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = sanityClient.createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN_DEV,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkPageFull() {
  console.log('🔍 Henter full page data...\n');

  const page = await client.fetch(`
    *[_type == "page" && slug.current == "hjem"][0] {
      _id,
      pageName,
      slug,
      sections[]{
        _type,
        _key,
        theme,
        title,

        _type == "grid" => {
          lists[]{
            _key,
            title,
            contentType,

            contentType == "job-position" => {
              "items": *[_type == "article" && type == "job-position"] | order(publishedAt desc) [0...6] {
                _id,
                title,
                excerpt,
                image{asset->, altText, hotspot},
                slug,
                publishedAt
              }
            }
          }
        }
      }
    }
  `);

  if (!page) {
    console.log('❌ Fant ikke hjem-siden');
    return;
  }

  console.log(`📄 Side: ${page.pageName}`);
  console.log(`🔗 Slug: ${page.slug?.current}\n`);

  // Finn grid sections
  const gridSections = page.sections?.filter(s => s._type === 'grid');

  if (!gridSections || gridSections.length === 0) {
    console.log('❌ Ingen grid sections funnet');
    return;
  }

  console.log(`📦 Fant ${gridSections.length} grid section(s)\n`);

  gridSections.forEach((section, index) => {
    console.log(`\n=== GRID ${index + 1}: ${section.title || 'Uten tittel'} ===`);

    if (!section.lists || section.lists.length === 0) {
      console.log('   ⚠️  Ingen lists i denne griden');
      return;
    }

    section.lists.forEach((list, listIndex) => {
      console.log(`\n${listIndex + 1}. ${list.title || 'Uten tittel'}`);
      console.log(`   Content Type: ${list.contentType}`);

      if (list.contentType === 'job-position') {
        console.log(`   🎯 JOB POSITION LIST FUNNET!`);

        if (list.items) {
          console.log(`   Items: ${list.items.length}`);

          if (list.items.length === 0) {
            console.log(`   ❌ INGEN ITEMS! Dette er problemet!`);
          } else {
            console.log(`   ✅ Items funnet:`);
            list.items.forEach(item => {
              console.log(`      - ${item.title} (${item.slug?.current})`);
            });
          }
        } else {
          console.log(`   ❌ ITEMS FIELD MANGLER! Dette er problemet!`);
        }
      }
    });
  });

  // Vis full JSON for debugging
  console.log('\n\n=== FULL PAGE JSON (sections) ===');
  console.log(JSON.stringify(page.sections, null, 2));
}

checkPageFull().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
