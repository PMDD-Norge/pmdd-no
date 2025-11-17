/**
 * Skann ALLE dokumenter for umigrerte felter
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

function hasInternationalizedFields(obj) {
  if (!obj || typeof obj !== 'object') return false;

  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      const first = obj[0];
      if (first && typeof first === 'object' && first._key && first._type && first.value !== undefined) {
        if (first._type?.includes('internationalizedArray') ||
            first._key === 'no' || first._key === 'nb' || first._key === 'nn') {
          return true;
        }
      }
    }
    return obj.some(item => hasInternationalizedFields(item));
  }

  return Object.values(obj).some(value => hasInternationalizedFields(value));
}

async function scanAllDocuments() {
  console.log('🔍 Skanner ALLE dokumenter for umigrerte felter...\n');

  // Hent alle dokumenter (ikke drafts)
  const allDocs = await client.fetch(`*[!(_id in path("drafts.**"))] {
    _id,
    _type,
    title,
    pageName,
    name
  }`);

  console.log(`📊 Totalt ${allDocs.length} dokumenter å sjekke\n`);

  const unmigratedDocs = [];

  for (const doc of allDocs) {
    // Hent fullt dokument
    const fullDoc = await client.getDocument(doc._id);

    if (hasInternationalizedFields(fullDoc)) {
      unmigratedDocs.push({
        id: fullDoc._id,
        type: fullDoc._type,
        title: fullDoc.title || fullDoc.pageName || fullDoc.name || 'Uten tittel'
      });
    }
  }

  if (unmigratedDocs.length === 0) {
    console.log('✅ ALLE dokumenter er migrert! Ingen umigrerte felter funnet.\n');
  } else {
    console.log(`❌ Fant ${unmigratedDocs.length} dokumenter med umigrerte felter:\n`);
    unmigratedDocs.forEach(doc => {
      console.log(`   🔴 ${doc.type}: ${doc.title}`);
      console.log(`      ID: ${doc.id}\n`);
    });
  }
}

scanAllDocuments().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
