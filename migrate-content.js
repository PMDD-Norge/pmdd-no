/**
 * Migreringsscript: Konverterer flerspråklig innhold til norsk-only
 *
 * Dette scriptet:
 * 1. Henter alle dokumenter med internationalizedArray-felter
 * 2. Konverterer dem til vanlige strings (norsk versjon)
 * 3. Oppdaterer dokumentene i Sanity
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

  // Hvis det allerede er en vanlig string/object, returner den
  if (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean') {
    return field;
  }

  // Hvis det er et array med internationalizedArrayStringValue
  if (Array.isArray(field)) {
    const norwegianItem = field.find(item =>
      item._key === 'no' || item._key === 'nb' || item._key === 'nn'
    );
    return norwegianItem?.value || field[0]?.value || null;
  }

  return field;
}

// Hjelpefunksjon: Konverterer slug fra array til object
function convertSlug(slugArray) {
  if (!slugArray) return null;

  // Hvis det allerede er et slug-objekt, returner det
  if (slugArray.current) return slugArray;

  // Hvis det er et internationalizedArray, konverter det
  if (Array.isArray(slugArray)) {
    const norwegianSlug = extractNorwegianValue(slugArray);
    return norwegianSlug ? { current: norwegianSlug, _type: 'slug' } : null;
  }

  return null;
}

// Hjelpefunksjon: Konverterer richText/PortableText array
function convertRichText(richTextArray) {
  if (!richTextArray) return null;

  // Hvis det allerede er PortableText blocks, returner det
  if (Array.isArray(richTextArray) && richTextArray[0]?._type === 'block') {
    return richTextArray;
  }

  // Hvis det er internationalizedArrayRichTextValue
  if (Array.isArray(richTextArray)) {
    const norwegianItem = richTextArray.find(item =>
      item._key === 'no' || item._key === 'nb' || item._key === 'nn'
    );
    return norwegianItem?.value || richTextArray[0]?.value || null;
  }

  return richTextArray;
}

// Hjelpefunksjon: Transformerer et objekt rekursivt
function transformObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  // Håndter arrays
  if (Array.isArray(obj)) {
    // Sjekk om dette er et internationalizedArray
    if (obj.length > 0 && obj[0]?._type?.includes('internationalizedArray')) {
      if (obj[0]._type === 'internationalizedArrayRichTextValue') {
        return convertRichText(obj);
      }
      return extractNorwegianValue(obj);
    }
    // Ellers, transformer hvert element
    return obj.map(item => transformObject(item));
  }

  // Håndter objekter
  const transformed = {};
  for (const [key, value] of Object.entries(obj)) {
    // Spesialtilfelle: slug
    if (key === 'slug') {
      transformed[key] = convertSlug(value);
    }
    // Spesialtilfelle: title, name, description, etc.
    else if (['title', 'name', 'description', 'altText', 'caption', 'quote', 'author', 'role', 'subtitle', 'lead', 'excerpt'].includes(key)) {
      transformed[key] = extractNorwegianValue(value);
    }
    // Spesialtilfelle: richText, body, content
    else if (['richText', 'body', 'content', 'description'].includes(key) && Array.isArray(value)) {
      transformed[key] = convertRichText(value);
    }
    // Rekursiv transformasjon
    else {
      transformed[key] = transformObject(value);
    }
  }

  return transformed;
}

// Hovedfunksjon: Migrer et dokument
async function migrateDocument(doc) {
  console.log(`\nMigrerer: ${doc._type} (${doc._id})`);

  try {
    const transformed = transformObject(doc);

    // Fjern system-felter som ikke skal oppdateres
    const { _rev, _createdAt, _updatedAt, ...updateData } = transformed;

    // Logg endringer
    console.log('  Før:', {
      title: doc.title,
      slug: doc.slug,
    });
    console.log('  Etter:', {
      title: updateData.title,
      slug: updateData.slug,
    });

    // Oppdater dokumentet
    await client
      .patch(doc._id)
      .set(updateData)
      .commit();

    console.log('  ✓ Migrert');
    return { success: true, id: doc._id, type: doc._type };
  } catch (error) {
    console.error('  ✗ Feil:', error.message);
    return { success: false, id: doc._id, type: doc._type, error: error.message };
  }
}

// Hovedfunksjon: Kjør migreringen
async function runMigration() {
  console.log('🚀 Starter migrering av innhold...\n');

  // Definer hvilke document types som skal migreres
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

  const results = {
    success: [],
    failed: [],
    skipped: [],
  };

  for (const type of typesToMigrate) {
    console.log(`\n📄 Henter ${type} dokumenter...`);

    try {
      // Hent alle dokumenter av denne typen
      const documents = await client.fetch(`*[_type == $type]`, { type });

      if (documents.length === 0) {
        console.log(`  Ingen ${type} dokumenter funnet`);
        continue;
      }

      console.log(`  Fant ${documents.length} dokument(er)`);

      // Migrer hvert dokument
      for (const doc of documents) {
        // Sjekk om dokumentet har internasjonaliserte felter
        const hasInternationalizedFields = JSON.stringify(doc).includes('internationalizedArray');

        if (!hasInternationalizedFields) {
          console.log(`  Hopper over ${doc._id} (allerede migrert)`);
          results.skipped.push({ id: doc._id, type: doc._type });
          continue;
        }

        const result = await migrateDocument(doc);

        if (result.success) {
          results.success.push(result);
        } else {
          results.failed.push(result);
        }

        // Vent litt mellom hver oppdatering for å unngå rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`✗ Feil ved henting av ${type}:`, error.message);
    }
  }

  // Oppsummering
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRERING FULLFØRT');
  console.log('='.repeat(60));
  console.log(`✓ Vellykkede: ${results.success.length}`);
  console.log(`✗ Feilet: ${results.failed.length}`);
  console.log(`⊘ Hoppet over: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log('\nFeilede dokumenter:');
    results.failed.forEach(({ id, type, error }) => {
      console.log(`  - ${type} (${id}): ${error}`);
    });
  }

  console.log('\n✨ Migrering fullført!\n');
}

// Kjør migreringen
runMigration().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
