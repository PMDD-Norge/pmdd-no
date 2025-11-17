/**
 * Finn felter som fortsatt har gammelt format
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

function findInternationalizedFields(obj, path = '') {
  const found = [];

  if (!obj || typeof obj !== 'object') {
    return found;
  }

  if (Array.isArray(obj)) {
    // Sjekk om dette er et internationalizedArray
    if (obj.length > 0 && obj[0]?._type?.includes('internationalizedArray')) {
      found.push({
        path,
        type: obj[0]._type,
        value: obj
      });
    } else if (obj.length > 0 && obj[0]?._key && obj[0]?._type && obj[0]?.value !== undefined) {
      // Alternativ sjekk for internasjonaliserte felter
      found.push({
        path,
        type: 'possible-internationalized',
        value: obj
      });
    } else {
      // Søk i array elementer
      obj.forEach((item, index) => {
        found.push(...findInternationalizedFields(item, `${path}[${index}]`));
      });
    }
  } else {
    // Søk i object properties
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      found.push(...findInternationalizedFields(value, newPath));
    }
  }

  return found;
}

async function findUnmigratedFields() {
  console.log('🔍 Søker etter umigrerte felter...\n');

  // Hent alle job position artikler
  const articles = await client.fetch(`*[_type == "article" && type == "job-position"]`);

  console.log(`📝 Sjekker ${articles.length} job-position artikler...\n`);

  articles.forEach(article => {
    console.log(`\n=== ${article.title || article._id} ===`);

    const unmigrated = findInternationalizedFields(article);

    if (unmigrated.length === 0) {
      console.log('✅ Ingen umigrerte felter');
    } else {
      console.log(`❌ Fant ${unmigrated.length} umigrerte felt(er):\n`);
      unmigrated.forEach(field => {
        console.log(`   Path: ${field.path}`);
        console.log(`   Type: ${field.type}`);
        console.log(`   Value:`, JSON.stringify(field.value, null, 2).substring(0, 200));
        console.log('');
      });
    }
  });

  // Sjekk også pages
  console.log('\n\n=== SJEKKER PAGES ===\n');
  const pages = await client.fetch(`*[_type == "page"]`);

  pages.forEach(page => {
    const unmigrated = findInternationalizedFields(page);

    if (unmigrated.length > 0) {
      console.log(`\n📄 ${page.pageName || page._id}`);
      console.log(`❌ Fant ${unmigrated.length} umigrerte felt(er):\n`);
      unmigrated.forEach(field => {
        console.log(`   Path: ${field.path}`);
        console.log(`   Type: ${field.type}`);
        console.log('');
      });
    }
  });
}

findUnmigratedFields().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
