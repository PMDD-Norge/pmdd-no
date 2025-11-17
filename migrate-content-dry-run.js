/**
 * DRY-RUN: Viser hva som vil bli endret uten å faktisk endre noe
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

// Hjelpefunksjon: Henter norsk verdi fra internationalizedArray
function extractNorwegianValue(field) {
  if (!field) return null;
  if (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean') {
    return field;
  }
  if (Array.isArray(field)) {
    const norwegianItem = field.find(item =>
      item._key === 'no' || item._key === 'nb' || item._key === 'nn'
    );
    return norwegianItem?.value || field[0]?.value || null;
  }
  return field;
}

// Hjelpefunksjon: Konverterer slug
function convertSlug(slugArray) {
  if (!slugArray) return null;
  if (slugArray.current) return slugArray;
  if (Array.isArray(slugArray)) {
    const norwegianSlug = extractNorwegianValue(slugArray);
    return norwegianSlug ? { current: norwegianSlug, _type: 'slug' } : null;
  }
  return null;
}

// Hjelpefunksjon: Konverterer richText
function convertRichText(richTextArray) {
  if (!richTextArray) return null;
  if (Array.isArray(richTextArray) && richTextArray[0]?._type === 'block') {
    return richTextArray;
  }
  if (Array.isArray(richTextArray)) {
    const norwegianItem = richTextArray.find(item =>
      item._key === 'no' || item._key === 'nb' || item._key === 'nn'
    );
    return norwegianItem?.value || richTextArray[0]?.value || null;
  }
  return richTextArray;
}

// Hjelpefunksjon: Transformerer objekt
function transformObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj[0]?._type?.includes('internationalizedArray')) {
      if (obj[0]._type === 'internationalizedArrayRichTextValue') {
        return convertRichText(obj);
      }
      return extractNorwegianValue(obj);
    }
    return obj.map(item => transformObject(item));
  }

  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'slug') {
      transformed[key] = convertSlug(value);
    } else if (['title', 'name', 'description', 'altText', 'caption', 'quote', 'author', 'role', 'subtitle', 'lead', 'excerpt'].includes(key)) {
      transformed[key] = extractNorwegianValue(value);
    } else if (['richText', 'body', 'content'].includes(key) && Array.isArray(value)) {
      transformed[key] = convertRichText(value);
    } else {
      transformed[key] = transformObject(value);
    }
  }

  return transformed;
}

// Vis forskjeller
function showDiff(before, after, path = '') {
  const changes = [];

  for (const key of Object.keys(before)) {
    const beforeValue = before[key];
    const afterValue = after[key];
    const currentPath = path ? `${path}.${key}` : key;

    // Sammenlign verdier
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changes.push({
        field: currentPath,
        before: beforeValue,
        after: afterValue,
      });
    }
  }

  return changes;
}

// Hovedfunksjon: Analyser dokument
async function analyzeDocument(doc) {
  const transformed = transformObject(doc);
  const { _rev, _createdAt, _updatedAt, ...updateData } = transformed;

  const changes = showDiff(doc, updateData);

  if (changes.length > 0) {
    console.log(`\n📄 ${doc._type}: ${doc._id}`);
    console.log('   Endringer som vil bli gjort:');

    changes.forEach(({ field, before, after }) => {
      if (field === 'title' || field === 'slug' || field === 'name') {
        console.log(`   • ${field}:`);
        console.log(`     FØR:  ${JSON.stringify(before)?.substring(0, 100)}...`);
        console.log(`     ETTER: ${JSON.stringify(after)?.substring(0, 100)}`);
      }
    });

    return { hasChanges: true, changeCount: changes.length };
  }

  return { hasChanges: false, changeCount: 0 };
}

// Hovedfunksjon: Kjør analyse
async function runDryRun() {
  console.log('🔍 DRY-RUN: Analyserer hva som vil bli endret...\n');
  console.log('⚠️  Dette vil IKKE gjøre endringer i databasen.\n');

  const typesToMigrate = [
    'page',
    'post',
    'article',
    'event',
    'highlights',
    'information',
    'collectionHub',
    'legalDocument',
    'availablePosition',
  ];

  const stats = {
    total: 0,
    willChange: 0,
    noChanges: 0,
    totalChanges: 0,
  };

  for (const type of typesToMigrate) {
    console.log(`\n📋 Analyserer ${type} dokumenter...`);

    try {
      const documents = await client.fetch(`*[_type == $type]`, { type });

      if (documents.length === 0) {
        console.log(`   Ingen ${type} dokumenter funnet`);
        continue;
      }

      console.log(`   Fant ${documents.length} dokument(er)`);
      stats.total += documents.length;

      for (const doc of documents) {
        const hasInternationalizedFields = JSON.stringify(doc).includes('internationalizedArray');

        if (!hasInternationalizedFields) {
          console.log(`   ⊘ Hopper over ${doc._id} (allerede migrert)`);
          stats.noChanges++;
          continue;
        }

        const result = await analyzeDocument(doc);

        if (result.hasChanges) {
          stats.willChange++;
          stats.totalChanges += result.changeCount;
        } else {
          stats.noChanges++;
        }
      }
    } catch (error) {
      console.error(`✗ Feil ved analyse av ${type}:`, error.message);
    }
  }

  // Oppsummering
  console.log('\n' + '='.repeat(60));
  console.log('📊 DRY-RUN RESULTAT');
  console.log('='.repeat(60));
  console.log(`📄 Totalt dokumenter: ${stats.total}`);
  console.log(`✏️  Vil bli endret: ${stats.willChange}`);
  console.log(`⊘ Ingen endringer: ${stats.noChanges}`);
  console.log(`🔄 Totalt antall felt-endringer: ${stats.totalChanges}`);

  if (stats.willChange > 0) {
    console.log('\n⚠️  For å kjøre faktisk migrering, kjør:');
    console.log('   node migrate-content.js');
  } else {
    console.log('\n✨ Alle dokumenter er allerede migrert!');
  }

  console.log('');
}

// Kjør analysen
runDryRun().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
