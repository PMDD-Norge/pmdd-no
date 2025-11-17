/**
 * Sjekker job position artikler og hvor de skal vises
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

async function checkJobPositions() {
  console.log('🔍 Sjekker job positions...\n');

  // 1. Sjekk articles av type job-position
  console.log('=== ARTICLE DOKUMENTER (type: job-position) ===');
  const articles = await client.fetch(`
    *[_type == "article" && type == "job-position"] {
      _id,
      _type,
      type,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      body
    }
  `);

  if (articles.length === 0) {
    console.log('❌ Ingen job-position articles funnet\n');
  } else {
    console.log(`✅ Fant ${articles.length} job-position article(s):\n`);
    articles.forEach(article => {
      console.log(`📝 ${article.title}`);
      console.log(`   ID: ${article._id}`);
      console.log(`   Type: ${article.type}`);
      console.log(`   Slug: ${article.slug?.current || 'MANGLER'}`);
      console.log(`   PublishedAt: ${article.publishedAt || 'MANGLER'}`);
      console.log(`   Excerpt: ${article.excerpt ? 'JA' : 'NEI'}`);
      console.log(`   Body: ${article.body ? 'JA' : 'NEI'}`);
      console.log('');
    });
  }

  // 2. Sjekk hvilke sider som har grid sections med job-position
  console.log('\n=== SIDER MED GRID SECTIONS ===');
  const pages = await client.fetch(`
    *[_type == "page" && count(sections[_type == "grid" && "job-position" in lists[].contentType]) > 0] {
      _id,
      pageName,
      slug,
      "gridSections": sections[_type == "grid"] {
        _key,
        title,
        lists[] {
          title,
          contentType
        }
      }
    }
  `);

  if (pages.length === 0) {
    console.log('❌ Ingen sider har grid sections med job-position\n');
  } else {
    console.log(`✅ Fant ${pages.length} side(r) med job-position grids:\n`);
    pages.forEach(page => {
      console.log(`📄 ${page.pageName} (${page.slug?.current})`);
      page.gridSections.forEach(section => {
        console.log(`   Grid: ${section.title || 'Uten tittel'}`);
        section.lists?.forEach(list => {
          if (list.contentType === 'job-position') {
            console.log(`      ✓ List: ${list.title} (type: ${list.contentType})`);
          }
        });
      });
      console.log('');
    });
  }

  // 3. Test query som nettsiden bruker
  console.log('\n=== TESTER NETTSIDE QUERY ===');
  const queryResult = await client.fetch(`
    *[_type == "article" && type == "job-position"] | order(publishedAt desc) [0...6] {
      _id,
      title,
      excerpt,
      image{asset->, altText, hotspot},
      slug,
      publishedAt
    }
  `);

  console.log(`Query resultat: ${queryResult.length} dokumenter`);
  if (queryResult.length > 0) {
    console.log('Query returnerer data ✅');
  } else {
    console.log('Query returnerer INGEN data ❌');
  }
}

checkJobPositions().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
