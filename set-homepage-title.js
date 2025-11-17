/**
 * Setter tittel på hjemmesiden for at frontend skal finne den
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

async function setHomepageTitle() {
  console.log('🏠 Setter tittel på hjemmesiden...\n');

  try {
    // Finn siden med slug "hjem"
    const homePage = await client.fetch(
      `*[_type == "page" && slug.current == "hjem"][0] {_id, title, slug}`
    );

    if (!homePage) {
      console.error('❌ Fant ingen side med slug "hjem"');
      process.exit(1);
    }

    console.log(`📄 Fant side: ${homePage._id}`);
    console.log(`   Nåværende tittel: ${homePage.title || '(null)'}`);
    console.log(`   Slug: ${homePage.slug?.current}`);

    // Oppdater tittel til "Forside"
    await client
      .patch(homePage._id)
      .set({ title: 'Forside' })
      .commit();

    console.log('\n✅ Tittel oppdatert til "Forside"');
    console.log('🌐 Nå kan frontend finne hjemmesiden!');

  } catch (error) {
    console.error('❌ Feil:', error.message);
    process.exit(1);
  }
}

setHomepageTitle();
