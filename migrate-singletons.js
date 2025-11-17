/**
 * Migrer singleton/settings dokumenter
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

// Hjelpefunksjoner
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

function convertSlug(slugArray) {
  if (!slugArray) return null;
  if (slugArray.current) return slugArray;
  if (Array.isArray(slugArray)) {
    const norwegianSlug = extractNorwegianValue(slugArray);
    return norwegianSlug ? { current: norwegianSlug, _type: 'slug' } : null;
  }
  return null;
}

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

function transformObject(obj, depth = 0) {
  if (depth > 20) return obj; // Prevent infinite recursion
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj[0]?._type?.includes('internationalizedArray')) {
      if (obj[0]._type === 'internationalizedArrayRichTextValue') {
        return convertRichText(obj);
      }
      return extractNorwegianValue(obj);
    }
    // Check for generic internationalized format
    if (obj.length > 0 && obj[0]?._key && obj[0]?._type && obj[0]?.value !== undefined) {
      if (obj[0]._key === 'no' || obj[0]._key === 'nb' || obj[0]._key === 'nn') {
        return extractNorwegianValue(obj);
      }
    }
    return obj.map(item => transformObject(item, depth + 1));
  }

  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'slug') {
      transformed[key] = convertSlug(value);
    }
    else if (['title', 'name', 'description', 'altText', 'caption', 'quote', 'author', 'role', 'subtitle', 'lead', 'excerpt', 'text', 'label', 'metaTitle', 'metaDescription'].includes(key)) {
      transformed[key] = extractNorwegianValue(value);
    }
    else if (['richText', 'body', 'content', 'description'].includes(key) && Array.isArray(value)) {
      transformed[key] = convertRichText(value);
    }
    else {
      transformed[key] = transformObject(value, depth + 1);
    }
  }

  return transformed;
}

async function migrateSingleton(docId) {
  console.log(`\n📝 Migrerer: ${docId}`);

  try {
    const doc = await client.getDocument(docId);

    if (!doc) {
      console.log(`   ❌ Dokument ikke funnet`);
      return { success: false, id: docId };
    }

    const transformed = transformObject(doc);
    const { _rev, _createdAt, _updatedAt, ...updateData } = transformed;

    console.log(`   Type: ${doc._type}`);

    await client
      .patch(docId)
      .set(updateData)
      .commit();

    console.log(`   ✅ Migrert`);
    return { success: true, id: docId };
  } catch (error) {
    console.error(`   ❌ Feil:`, error.message);
    return { success: false, id: docId, error: error.message };
  }
}

async function migrateSingletons() {
  console.log('🚀 Migrerer singleton dokumenter...\n');
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  const singletonIds = [
    'globalTranslations',
    'highlights',
    'information',
    'navigationManager',
    'seoFallback'
  ];

  const results = { success: [], failed: [] };

  for (const id of singletonIds) {
    const result = await migrateSingleton(id);
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRERING FULLFØRT');
  console.log('='.repeat(60));
  console.log(`✅ Vellykkede: ${results.success.length}`);
  console.log(`❌ Feilet: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFeilede dokumenter:');
    results.failed.forEach(({ id, error }) => {
      console.log(`  - ${id}: ${error || 'Ukjent feil'}`);
    });
  }

  console.log('\n✨ Ferdig!\n');
}

migrateSingletons().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
