/**
 * Fullstending migrering:
 * 1. Fullfører feltmigrering (internationalizedArray -> strings)
 * 2. Konverterer post -> article
 * 3. Konverterer availablePosition -> article
 * 4. Legger til manglende slugs
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

// Hjelpefunksjon: Transformerer objekt rekursivt
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
    }
    else if (['title', 'name', 'description', 'altText', 'caption', 'quote', 'author', 'role', 'subtitle', 'lead', 'excerpt'].includes(key)) {
      transformed[key] = extractNorwegianValue(value);
    }
    else if (['richText', 'body', 'content'].includes(key) && Array.isArray(value)) {
      transformed[key] = convertRichText(value);
    }
    else {
      transformed[key] = transformObject(value);
    }
  }

  return transformed;
}

// Generer slug fra tittel
function generateSlug(title) {
  if (!title) return null;
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // fjern aksenter
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Migrer et dokument
async function migrateDocument(doc, convertType = null) {
  const docId = doc._id;
  const docType = doc._type;

  console.log(`\n📝 Migrerer: ${docType} (${docId})`);

  try {
    const transformed = transformObject(doc);
    const { _rev, _createdAt, _updatedAt, ...updateData } = transformed;

    // Konverter type hvis spesifisert
    if (convertType) {
      updateData._type = convertType;
      console.log(`   🔄 Konverterer type: ${docType} -> ${convertType}`);
    }

    // Legg til slug hvis mangler
    if (!updateData.slug || !updateData.slug.current) {
      const titleForSlug = updateData.title || updateData.name || updateData.pageName;
      if (titleForSlug) {
        updateData.slug = {
          _type: 'slug',
          current: generateSlug(titleForSlug)
        };
        console.log(`   🔗 Genererte slug: ${updateData.slug.current}`);
      }
    }

    // For post -> article konvertering
    if (docType === 'post' && convertType === 'article') {
      updateData.type = 'blog-post';
      // Konverter richText til body hvis body ikke finnes
      if (updateData.richText && !updateData.body) {
        updateData.body = updateData.richText;
        delete updateData.richText;
      }
      // Konverter lead til excerpt hvis excerpt ikke finnes
      if (updateData.lead && !updateData.excerpt) {
        updateData.excerpt = updateData.lead;
        delete updateData.lead;
      }
      console.log(`   ✏️  Satt article type: blog-post`);
    }

    // For availablePosition -> article konvertering
    if (docType === 'availablePosition' && convertType === 'article') {
      updateData.type = 'job-position';
      console.log(`   ✏️  Satt article type: job-position`);
    }

    console.log('   Før:', {
      title: doc.title || doc.name,
      slug: doc.slug,
    });
    console.log('   Etter:', {
      title: updateData.title || updateData.name,
      slug: updateData.slug,
    });

    await client
      .patch(docId)
      .set(updateData)
      .commit();

    console.log('   ✅ Migrert');
    return { success: true, id: docId, type: docType };
  } catch (error) {
    console.error('   ❌ Feil:', error.message);
    return { success: false, id: docId, type: docType, error: error.message };
  }
}

// Hovedfunksjon
async function runCompleteMigration() {
  console.log('🚀 Starter fullstendig migrering...\n');
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  const results = { success: [], failed: [], skipped: [] };

  // 1. Migrer post -> article
  console.log('\n=== 1. KONVERTER POST -> ARTICLE ===');
  const posts = await client.fetch(`*[_type == "post"]`);
  console.log(`Fant ${posts.length} post dokumenter`);
  for (const post of posts) {
    const result = await migrateDocument(post, 'article');
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 2. Migrer availablePosition -> article
  console.log('\n=== 2. KONVERTER AVAILABLEPOSITION -> ARTICLE ===');
  const positions = await client.fetch(`*[_type == "availablePosition"]`);
  console.log(`Fant ${positions.length} availablePosition dokumenter`);
  for (const position of positions) {
    const result = await migrateDocument(position, 'article');
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 3. Fikse events (legg til slugs)
  console.log('\n=== 3. FIKSE EVENTS ===');
  const events = await client.fetch(`*[_type == "event"]`);
  console.log(`Fant ${events.length} event dokumenter`);
  for (const event of events) {
    const result = await migrateDocument(event);
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 4. Fikse categories (legg til slugs)
  console.log('\n=== 4. FIKSE CATEGORIES ===');
  const categories = await client.fetch(`*[_type == "category"]`);
  console.log(`Fant ${categories.length} category dokumenter`);
  for (const category of categories) {
    const result = await migrateDocument(category);
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Oppsummering
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRERING FULLFØRT');
  console.log('='.repeat(60));
  console.log(`✅ Vellykkede: ${results.success.length}`);
  console.log(`❌ Feilet: ${results.failed.length}`);
  console.log(`⊘ Hoppet over: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log('\nFeilede dokumenter:');
    results.failed.forEach(({ id, type, error }) => {
      console.log(`  - ${type} (${id}): ${error}`);
    });
  }

  console.log('\n✨ Ferdig!\n');
}

runCompleteMigration().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
