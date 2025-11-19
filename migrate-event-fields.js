/**
 * Migrer event-dokumenter: Rename description -> body
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

async function migrateEvents() {
  console.log('🚀 Starter migrering av event-felter...\n');

  // Hent alle events
  const events = await client.fetch(`*[_type == "event"]{
    _id,
    _rev,
    title,
    description,
    body
  }`);

  console.log(`Fant ${events.length} events\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const event of events) {
    try {
      // Hvis description finnes men body ikke finnes
      if (event.description && !event.body) {
        console.log(`📝 Migrerer: ${event.title || event._id}`);
        console.log(`   Flytter 'description' -> 'body'`);

        await client
          .patch(event._id)
          .set({ body: event.description })
          .unset(['description'])
          .commit();

        console.log(`   ✅ Migrert\n`);
        migrated++;
      }
      // Hvis body allerede finnes
      else if (event.body) {
        console.log(`⊘ Hopper over: ${event.title || event._id} (body finnes allerede)`);
        skipped++;
      }
      // Hvis verken description eller body finnes
      else {
        console.log(`⚠️  Ingen innhold: ${event.title || event._id} (verken description eller body)`);
        skipped++;
      }

      // Liten pause for å ikke overbelaste API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Feil ved migrering av ${event._id}:`, error.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRERING FULLFØRT');
  console.log('='.repeat(60));
  console.log(`✅ Migrert: ${migrated}`);
  console.log(`⊘ Hoppet over: ${skipped}`);
  console.log(`❌ Feil: ${errors}`);
  console.log('\n✨ Ferdig!\n');
}

migrateEvents().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
