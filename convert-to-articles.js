/**
 * Konverterer post og availablePosition til article
 * ved å opprette nye dokumenter (siden _type ikke kan endres)
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

async function convertPostToArticle(post) {
  console.log(`\n📝 Konverterer post: ${post._id}`);

  try {
    const transformed = transformObject(post);

    // Fjern system-felter
    const { _id, _type, _rev, _createdAt, _updatedAt, ...data } = transformed;

    // Konverter felter for article
    const articleData = {
      _type: 'article',
      type: 'blog-post',
      title: data.title,
      slug: data.slug,
      excerpt: data.lead || data.excerpt,
      body: data.richText || data.body,
      publishedAt: data.publishedAt || new Date().toISOString(),
      featured: data.featured || false,
      image: data.image,
      categories: data.categories,
      author: data.author,
      seo: data.seo,
    };

    // Fjern undefined verdier
    Object.keys(articleData).forEach(key => {
      if (articleData[key] === undefined) delete articleData[key];
    });

    console.log('   Ny article data:', {
      type: articleData.type,
      title: articleData.title,
      slug: articleData.slug,
    });

    // Opprett nytt dokument
    const newDoc = await client.create(articleData);
    console.log(`   ✅ Opprettet ny article: ${newDoc._id}`);

    // Slett gammelt dokument
    await client.delete(post._id);
    console.log(`   🗑️  Slettet gammelt post-dokument`);

    return { success: true, oldId: post._id, newId: newDoc._id };
  } catch (error) {
    console.error(`   ❌ Feil:`, error.message);
    return { success: false, id: post._id, error: error.message };
  }
}

async function convertPositionToArticle(position) {
  console.log(`\n📝 Konverterer availablePosition: ${position._id}`);

  try {
    const transformed = transformObject(position);

    // Fjern system-felter
    const { _id, _type, _rev, _createdAt, _updatedAt, ...data } = transformed;

    // Konverter felter for article
    const articleData = {
      _type: 'article',
      type: 'job-position',
      title: data.title,
      slug: data.slug,
      excerpt: data.lead || data.excerpt,
      body: data.richText || data.body,
      publishedAt: data.publishedAt || new Date().toISOString(),
      featured: data.featured || false,
      image: data.image,
      categories: data.categories,
      seo: data.seo,
    };

    // Fjern undefined verdier
    Object.keys(articleData).forEach(key => {
      if (articleData[key] === undefined) delete articleData[key];
    });

    console.log('   Ny article data:', {
      type: articleData.type,
      title: articleData.title,
      slug: articleData.slug,
    });

    // Opprett nytt dokument
    const newDoc = await client.create(articleData);
    console.log(`   ✅ Opprettet ny article: ${newDoc._id}`);

    // Slett gammelt dokument
    await client.delete(position._id);
    console.log(`   🗑️  Slettet gammelt availablePosition-dokument`);

    return { success: true, oldId: position._id, newId: newDoc._id };
  } catch (error) {
    console.error(`   ❌ Feil:`, error.message);
    return { success: false, id: position._id, error: error.message };
  }
}

async function convertToArticles() {
  console.log('🚀 Konverterer til articles...\n');
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  const results = { success: [], failed: [] };

  // Konverter posts
  console.log('=== KONVERTER POST -> ARTICLE ===');
  const posts = await client.fetch(`*[_type == "post"]`);
  console.log(`Fant ${posts.length} post dokumenter\n`);

  for (const post of posts) {
    const result = await convertPostToArticle(post);
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Konverter availablePositions
  console.log('\n=== KONVERTER AVAILABLEPOSITION -> ARTICLE ===');
  const positions = await client.fetch(`*[_type == "availablePosition"]`);
  console.log(`Fant ${positions.length} availablePosition dokumenter\n`);

  for (const position of positions) {
    const result = await convertPositionToArticle(position);
    result.success ? results.success.push(result) : results.failed.push(result);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Oppsummering
  console.log('\n' + '='.repeat(60));
  console.log('📊 KONVERTERING FULLFØRT');
  console.log('='.repeat(60));
  console.log(`✅ Vellykkede: ${results.success.length}`);
  console.log(`❌ Feilet: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFeilede dokumenter:');
    results.failed.forEach(({ id, error }) => {
      console.log(`  - ${id}: ${error}`);
    });
  }

  if (results.success.length > 0) {
    console.log('\nVellykkede konverteringer:');
    results.success.forEach(({ oldId, newId }) => {
      console.log(`  - ${oldId} -> ${newId}`);
    });
  }

  console.log('\n✨ Ferdig!\n');
}

convertToArticles().catch(error => {
  console.error('💥 Fatal feil:', error);
  process.exit(1);
});
