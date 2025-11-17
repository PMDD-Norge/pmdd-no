/**
 * Diagnostikkscript: Sjekker om innholdet er migrert
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

async function checkMigrationStatus() {
  console.log('🔍 Sjekker migreringsstatus...\n');
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  const typesToCheck = [
    'page',
    'article',
    'event',
    'writer'
  ];

  for (const type of typesToCheck) {
    console.log(`\n📄 Sjekker ${type}...`);

    try {
      // Hent et eksempel-dokument
      const doc = await client.fetch(`*[_type == $type][0]`, { type });

      if (!doc) {
        console.log(`  ⚠️  Ingen ${type} dokumenter funnet`);
        continue;
      }

      console.log(`  📝 Dokument ID: ${doc._id}`);

      // Sjekk om det har internasjonaliserte felter
      const hasInternationalizedFields = JSON.stringify(doc).includes('internationalizedArray');

      if (hasInternationalizedFields) {
        console.log(`  ❌ IKKE MIGRERT - inneholder fortsatt internationalizedArray`);

        // Vis eksempel på umigrert data
        if (doc.title && Array.isArray(doc.title)) {
          console.log(`     Eksempel - title:`, JSON.stringify(doc.title, null, 2));
        }
        if (doc.slug && Array.isArray(doc.slug)) {
          console.log(`     Eksempel - slug:`, JSON.stringify(doc.slug, null, 2));
        }
      } else {
        console.log(`  ✅ MIGRERT`);

        // Vis eksempel på migrert data
        if (doc.title) {
          console.log(`     title: "${doc.title}"`);
        }
        if (doc.slug) {
          console.log(`     slug:`, JSON.stringify(doc.slug, null, 2));
        }
      }

      // Vis alle feltnavn for debugging
      console.log(`     Tilgjengelige felt:`, Object.keys(doc).join(', '));

    } catch (error) {
      console.error(`  ✗ Feil ved henting av ${type}:`, error.message);
    }
  }

  console.log('\n✨ Sjekk fullført!\n');
}

checkMigrationStatus().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
