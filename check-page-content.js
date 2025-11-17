/**
 * Sjekker innholdet i en side for å se hva som finnes
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

async function checkPageContent() {
  console.log('🔍 Sjekker sideinnhold...\n');

  try {
    // Hent forsiden
    const page = await client.fetch(`
      *[_type == "page" && (pageName == "Forside" || pageName == "Home")][0] {
        _id,
        pageName,
        slug,
        sections[]{
          _type,
          _key,
          title,
          subtitle,
          description,

          // For grid sections
          _type == "grid" => {
            lists[]{
              title,
              contentType,
              items
            }
          }
        }
      }
    `);

    if (!page) {
      console.log('❌ Fant ikke forside');
      return;
    }

    console.log(`📄 Side: ${page.pageName}`);
    console.log(`🔗 Slug: ${page.slug?.current}\n`);

    if (!page.sections || page.sections.length === 0) {
      console.log('⚠️  Ingen sections funnet');
      return;
    }

    console.log(`📦 Antall sections: ${page.sections.length}\n`);

    page.sections.forEach((section, index) => {
      console.log(`\n${index + 1}. ${section._type}`);

      if (section.title) console.log(`   Title: "${section.title}"`);
      if (section.subtitle) console.log(`   Subtitle: "${section.subtitle}"`);
      if (section.description) console.log(`   Description: ${section.description ? 'JA' : 'NEI'}`);

      // Spesialsjekk for grid sections
      if (section._type === 'grid' && section.lists) {
        console.log(`   📋 Lists: ${section.lists.length}`);
        section.lists.forEach((list, listIndex) => {
          console.log(`      ${listIndex + 1}. ${list.title || 'Uten tittel'}`);
          console.log(`         Type: ${list.contentType}`);
          if (list.items) {
            console.log(`         Items: ${Array.isArray(list.items) ? list.items.length : 'N/A'}`);
          }
        });
      }
    });

    // Tell opp manglende felt
    let missingSections = 0;
    page.sections.forEach(section => {
      if (!section.title && section._type !== 'image' && section._type !== 'quote') {
        missingSections++;
      }
    });

    console.log(`\n\n📊 Oppsummering:`);
    console.log(`   Sections: ${page.sections.length}`);
    console.log(`   Sections uten title: ${missingSections}`);

  } catch (error) {
    console.error('💥 Feil:', error);
  }
}

checkPageContent().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
