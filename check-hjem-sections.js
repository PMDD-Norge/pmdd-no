/**
 * Sjekk alle sections på Hjem-siden for umigrerte felter
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

function findInternationalizedFields(obj, path = '', depth = 0) {
  const found = [];

  if (depth > 10) return found; // Prevent infinite recursion

  if (!obj || typeof obj !== 'object') {
    return found;
  }

  if (Array.isArray(obj)) {
    // Sjekk om dette er et internationalizedArray
    if (obj.length > 0) {
      const first = obj[0];
      if (first && typeof first === 'object' && first._key && first._type && first.value !== undefined) {
        // Dette ser ut som et internasjonalisert felt
        if (first._type.includes('internationalizedArray') ||
            (first._key === 'no' || first._key === 'nb' || first._key === 'nn')) {
          found.push({
            path,
            sample: JSON.stringify(obj[0], null, 2)
          });
          return found; // Ikke gå dypere
        }
      }
    }

    // Søk i array elementer
    obj.forEach((item, index) => {
      found.push(...findInternationalizedFields(item, `${path}[${index}]`, depth + 1));
    });
  } else {
    // Søk i object properties
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('_') && key !== '_type' && key !== '_key') continue; // Skip system fields
      const newPath = path ? `${path}.${key}` : key;
      found.push(...findInternationalizedFields(value, newPath, depth + 1));
    }
  }

  return found;
}

async function checkHjemSections() {
  console.log('🔍 Sjekker Hjem-siden for umigrerte felter...\n');

  // Hent hele Hjem-siden
  const page = await client.fetch(`*[_type == "page" && slug.current == "hjem"][0]`);

  if (!page) {
    console.log('❌ Fant ikke hjem-siden');
    return;
  }

  console.log(`📄 Side: ${page.pageName}\n`);

  if (!page.sections) {
    console.log('❌ Ingen sections funnet');
    return;
  }

  console.log(`📦 Sjekker ${page.sections.length} sections...\n`);

  page.sections.forEach((section, index) => {
    console.log(`\n=== SECTION ${index + 1}: ${section._type} (${section.title || 'Uten tittel'}) ===`);

    const unmigrated = findInternationalizedFields(section);

    if (unmigrated.length === 0) {
      console.log('✅ Ingen umigrerte felter');
    } else {
      console.log(`❌ Fant ${unmigrated.length} umigrerte felt(er):\n`);
      unmigrated.forEach(field => {
        console.log(`   🔴 Path: ${field.path}`);
        console.log(`   Sample:`, field.sample.substring(0, 150));
        console.log('');
      });
    }
  });

  // Sjekk også SEO feltet
  console.log('\n\n=== SEO FELT ===');
  if (page.seo) {
    const seoUnmigrated = findInternationalizedFields(page.seo, 'seo');
    if (seoUnmigrated.length > 0) {
      console.log(`❌ Fant ${seoUnmigrated.length} umigrerte felt(er) i SEO`);
      seoUnmigrated.forEach(field => {
        console.log(`   🔴 Path: ${field.path}`);
      });
    } else {
      console.log('✅ SEO er migrert');
    }
  }
}

checkHjemSections().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
