/**
 * Inspiserer umigrerte dokumenter
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

async function inspectUnmigrated() {
  console.log('🔍 Inspiserer umigrerte dokumenter...\n');

  // Sjekk post
  console.log('=== POST ===');
  const post = await client.fetch(`*[_type == "post"][0]`);
  if (post) {
    console.log('Full struktur:', JSON.stringify(post, null, 2));
  }

  // Sjekk event
  console.log('\n\n=== EVENT ===');
  const event = await client.fetch(`*[_type == "event"][0]`);
  if (event) {
    console.log('Full struktur:', JSON.stringify(event, null, 2));
  }

  // Sjekk availablePosition
  console.log('\n\n=== AVAILABLE POSITION ===');
  const position = await client.fetch(`*[_type == "availablePosition"][0]`);
  if (position) {
    console.log('Full struktur:', JSON.stringify(position, null, 2));
  }

  // Sjekk category
  console.log('\n\n=== CATEGORY ===');
  const category = await client.fetch(`*[_type == "category"][0]`);
  if (category) {
    console.log('Full struktur:', JSON.stringify(category, null, 2));
  }
}

inspectUnmigrated().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
