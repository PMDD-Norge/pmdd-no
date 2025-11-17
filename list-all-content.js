/**
 * Lister alt innhold i datasettet
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

async function listAllContent() {
  console.log('📋 Lister alt innhold i datasettet...\n');
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  const typesToCheck = [
    'page',
    'article',
    'post',
    'event',
    'writer',
    'collectionHub',
    'legalDocument',
    'availablePosition',
    'resource',
    'category'
  ];

  for (const type of typesToCheck) {
    try {
      const docs = await client.fetch(`*[_type == $type] {
        _id,
        title,
        pageName,
        name,
        slug
      }`, { type });

      if (docs.length === 0) {
        console.log(`❌ ${type}: Ingen dokumenter`);
      } else {
        console.log(`✅ ${type}: ${docs.length} dokument(er)`);
        docs.forEach(doc => {
          const displayName = doc.title || doc.pageName || doc.name || doc._id;
          const slug = doc.slug?.current || 'ingen slug';
          console.log(`   - ${displayName} (${slug})`);
        });
      }
    } catch (error) {
      console.error(`⚠️  ${type}: Feil - ${error.message}`);
    }
  }

  console.log('\n');
}

listAllContent().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
