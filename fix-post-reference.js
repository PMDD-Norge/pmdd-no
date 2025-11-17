/**
 * Finner og oppdaterer referanser til det gamle post-dokumentet
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

const OLD_POST_ID = 'ecec27cb-d633-483b-b98e-9d83e54561fe';
const NEW_ARTICLE_ID = 'Ic3kixMkY8uQgblwpOPmW8';
const REFERENCING_DOC_ID = '438591f8-f5c6-4a6e-9404-feab5717b34e';

async function fixReference() {
  console.log('🔍 Undersøker referanse...\n');

  // Hent det refererende dokumentet
  const doc = await client.getDocument(REFERENCING_DOC_ID);

  if (!doc) {
    console.log('❌ Fant ikke refererende dokument');
    return;
  }

  console.log(`📄 Refererende dokument:`);
  console.log(`   Type: ${doc._type}`);
  console.log(`   ID: ${doc._id}`);

  if (doc.title || doc.pageName || doc.name) {
    console.log(`   Navn: ${doc.title || doc.pageName || doc.name}`);
  }

  // Søk etter referanser i dokumentet
  const docStr = JSON.stringify(doc, null, 2);

  if (docStr.includes(OLD_POST_ID)) {
    console.log(`\n✅ Fant referanse til gammelt post-dokument`);

    // Erstatt referansen
    const updatedDocStr = docStr.replace(
      new RegExp(OLD_POST_ID, 'g'),
      NEW_ARTICLE_ID
    );

    const updatedDoc = JSON.parse(updatedDocStr);

    // Fjern system-felter
    const { _rev, _createdAt, _updatedAt, ...updateData } = updatedDoc;

    console.log(`\n🔄 Oppdaterer referanse...`);
    console.log(`   ${OLD_POST_ID} -> ${NEW_ARTICLE_ID}`);

    try {
      await client
        .patch(doc._id)
        .set(updateData)
        .commit();

      console.log(`✅ Referanse oppdatert!`);

      // Nå kan vi slette det gamle post-dokumentet
      console.log(`\n🗑️  Sletter gammelt post-dokument...`);
      await client.delete(OLD_POST_ID);
      console.log(`✅ Gammelt post-dokument slettet!`);

      console.log(`\n✨ Fullført! Post er nå konvertert til article.`);
    } catch (error) {
      console.error(`❌ Feil ved oppdatering:`, error.message);
    }
  } else {
    console.log(`⚠️  Fant ikke referanse i dokumentet`);
    console.log(`\nDokumentets innhold:`);
    console.log(docStr);
  }
}

fixReference().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
