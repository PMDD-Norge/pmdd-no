import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('\n=== PAGES WITH ARTICLE SECTIONS ===');
const pages = await client.fetch(`*[_type == "page"]{
  _id,
  pageName,
  "articleSections": sections[_type == "article"]{
    _type,
    _key,
    title,
    tag,
    richText,
    appearance
  }
}`);

const pagesWithArticles = pages.filter(p => p.articleSections && p.articleSections.length > 0);
console.log('Pages with article sections:', pagesWithArticles.length);
console.log(JSON.stringify(pagesWithArticles, null, 2));
