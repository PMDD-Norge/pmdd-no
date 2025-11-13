# Sanity Studio - Frontend Integrasjonsguide

Dette dokumentet beskriver hvordan du kobler Sanity Studio til frontend-applikasjonen for PMDD Norge.

## 📋 Innholdsfortegnelse

- [Prosjektinformasjon](#prosjektinformasjon)
- [Tilgjengelige Schemas](#tilgjengelige-schemas)
- [Setup og Konfigurasjon](#setup-og-konfigurasjon)
- [GROQ Queries](#groq-queries)
- [TypeScript Types](#typescript-types)
- [Best Practices](#best-practices)
- [Eksempler](#eksempler)

## 🔧 Prosjektinformasjon

### Sanity Konfigurasjon

```typescript
projectId: "e7m3wa6s";
dataset: "production";
apiVersion: "2024-01-01";
```

### Studio URL

- **Produksjon**: `https://pmdd-norge.sanity.studio/`
- **Lokalt**: `http://localhost:3333/`

## 📚 Tilgjengelige Schemas

### Documents (Hovedinnholdstyper)

#### Content Types

**`article`** - Artikler/Blogginnlegg/Nyheter/Jobbannonser

```typescript
{
  _type: 'article'
  type: 'blog-post' | 'news' | 'job-position'
  title: string
  slug: {current: string}
  excerpt?: string
  body: PortableText[]
  image?: Image
  publishedAt?: datetime
  categories?: Reference<category>[]
  author?: Reference<writer>
  featured?: boolean
  seo?: SEO
}
```

**`collectionHub`** - Samlesider for artikler/ressurser

```typescript
{
  _type: 'collectionHub'
  type: 'blog' | 'news' | 'highlights' | 'resources'
  page: string
  title: string
  description?: string
  image?: Image
  contactSection?: ContactSection
  allPostsLabel?: string
  seo?: SEO
}
```

**`resource`** - Ressurser (nedlastbare filer, videoer, etc.)

```typescript
{
  _type: 'resource'
  resourceType: 'pdf' | 'video' | 'link' | 'guide'
  title: string
  description?: string
  body?: PortableText[]
  image?: Image
  categories?: Reference<category>[]
  featured?: boolean
  externalUrl?: string
  file?: File
}
```

**`event`** - Arrangementer

```typescript
{
  _type: 'event'
  title: string
  body: PortableText[]
  image?: Image
  startDate: datetime
  endDate?: datetime
  location?: string
  registrationLink?: Link
}
```

**`page`** - Sider med seksjoner

```typescript
{
  _type: 'page'
  title: string
  slug: {current: string}
  sections: Section[]  // Hero, Grid, Callout, Contact, etc.
  seo?: SEO
}
```

#### Taxonomy

**`category`** - Kategorier for artikler og ressurser

```typescript
{
  _type: 'category'
  name: string
  slug: {current: string}
  description?: string
}
```

**`writer`** - Forfattere/Team medlemmer

```typescript
{
  _type: 'writer'
  name: string
  slug: {current: string}
  bio?: PortableText[]
  image?: Image
  role?: string
  email?: string
  linkedin?: string
}
```

#### Settings (Singletons)

**`brandAssets`** - Logo og brand assets

```typescript
{
  _id: 'brandAssets'
  _type: 'brandAssets'
  primaryLogo: Image
  secondaryLogo?: Image
  favicon?: Image
}
```

**`navigationManager`** - Navigasjon

```typescript
{
  _id: 'navigationManager'
  _type: 'navigationManager'
  mainNavigation: Link[]
  ctaButton?: CallToAction
  footerSections?: FooterSection[]
}
```

**`seoFallback`** - Standard SEO innstillinger

```typescript
{
  _id: "seoFallback";
  _type: "seoFallback";
  seo: SEO;
}
```

**`socialMediaProfiles`** - Sosiale medier

```typescript
{
  _id: 'socialMediaProfiles'
  _type: 'socialMediaProfiles'
  profiles: SocialMedia[]
}
```

**`companyInformation`** - Organisasjonsinformasjon

```typescript
{
  _id: "companyInformation";
  _type: "companyInformation";
  organizationName: string;
  organizationNumber: string;
  address: string;
  email: string;
  phone: string;
}
```

### Objects (Gjenbrukbare komponenter)

#### Sections (for Page builder)

Alle seksjoner har felles felter:

- `_key: string` - Unik ID for seksjonen
- `theme?: 'light' | 'dark'` - Fargetema

**`hero`** - Hero seksjon

```typescript
{
  _type: 'hero'
  title: string
  subtitle?: string
  body?: PortableText[]
  image?: Image
  callToActions?: CallToAction[]
  imagePosition?: 'left' | 'right'
  theme?: 'light' | 'dark'
}
```

**`grid`** - Grid med elementer eller automatisk innhold

```typescript
{
  _type: 'grid'
  title?: string
  lists: GridList[]
}

// GridList kan være:
// - Manual items (gridItem[])
// - Auto-populate: 'writer' | 'event' | 'article' | 'resource'
```

**`callout`** - Fremhevet innhold

```typescript
{
  _type: 'callout'
  title: string
  body?: PortableText[]
  callToActions?: CallToAction[]
  theme?: 'light' | 'dark'
}
```

**`contact`** - Kontaktinformasjon

```typescript
{
  _type: 'contact'
  title: string
  description?: string
  showCompanyInfo?: boolean
  additionalInfo?: PortableText[]
}
```

**`article`** - Artikkel-seksjon (for embedding)

```typescript
{
  _type: 'article'
  title?: string
  body: PortableText[]
  image?: Image
  imagePosition?: 'left' | 'right'
}
```

**`features`** - Feature liste

```typescript
{
  _type: 'features'
  title?: string
  features: Feature[]
}

// Feature:
{
  title: string
  description?: string
  icon?: string  // Emoji eller icon name
}
```

**`testimonials`** - Anbefalinger

```typescript
{
  _type: 'testimonials'
  title?: string
  testimonies: Testimony[]
}

// Testimony:
{
  name: string
  company?: string
  quote: string
  image?: Image
}
```

**`image`** - Bilde-seksjon

```typescript
{
  _type: 'image'
  image: Image
  caption?: string
}
```

**`quote`** - Sitat

```typescript
{
  _type: 'quote'
  quote: string
  author?: string
  role?: string
}
```

**`resources`** - Grupperte ressurser

```typescript
{
  _type: 'resources'
  title?: string
  groups: ResourceGroup[]
}
```

**`logoSalad`** - Logo grid

```typescript
{
  _type: 'logoSalad'
  title?: string
  logos: Image[]
}
```

#### Reusable Objects

**`link`** - Lenker

```typescript
{
  _type: 'link'
  title: string
  type: 'internal' | 'external' | 'email' | 'phone'

  // Avhengig av type:
  internalLink?: Reference  // internal
  url?: string              // external
  email?: string            // email
  phone?: string            // phone

  anchor?: string           // Anchor for internal links
  newTab?: boolean          // Åpne i ny fane
}
```

**`seo`** - SEO metadata

```typescript
{
  _type: 'seo'
  metaTitle?: string
  metaDescription?: string
  openGraphImage?: Image
  noIndex?: boolean
}
```

**`image`** - Bilde med metadata

```typescript
{
  asset: Reference
  hotspot?: {x: number, y: number}
  altText?: string
  title?: string
  description?: string
  credits?: string
}
```

## ⚙️ Setup og Konfigurasjon

### Installer Dependencies

```bash
npm install @sanity/client @sanity/image-url
npm install --save-dev @sanity/types
```

### Opprett Sanity Client

```typescript
// lib/sanity.client.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

// For å bygge image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=e7m3wa6s
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Optional: For draft mode / preview
SANITY_API_READ_TOKEN=your_token_here
```

## 📝 GROQ Queries

### Grunnleggende Queries

**Hent alle artikler**

```groq
*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  _type,
  type,
  title,
  slug,
  excerpt,
  publishedAt,
  featured,
  "image": image{
    asset->,
    altText,
    hotspot
  },
  "categories": categories[]->{
    _id,
    name,
    slug
  },
  "author": author->{
    _id,
    name,
    slug,
    image
  }
}
```

**Hent en side med alle seksjoner**

```groq
*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,

    // Hero
    _type == "hero" => {
      title,
      subtitle,
      body,
      image{asset->, altText, hotspot},
      callToActions[]{
        title,
        link->{...}
      },
      imagePosition,
      theme
    },

    // Grid
    _type == "grid" => {
      title,
      lists[]{
        title,
        contentType,

        // Manual items
        contentType == "manual" => {
          items[]{
            title,
            description,
            image{asset->, altText},
            link->{...}
          }
        },

        // Auto-populated (writers example)
        contentType == "writer" => {
          "items": *[_type == "writer"]{
            _id,
            name,
            role,
            image,
            slug
          }
        }
      },
      theme
    },

    // Contact
    _type == "contact" => {
      title,
      description,
      showCompanyInfo,
      showCompanyInfo == true => {
        "companyInfo": *[_type == "companyInformation"][0]{
          organizationName,
          address,
          email,
          phone
        }
      },
      additionalInfo
    }
  },
  seo{
    metaTitle,
    metaDescription,
    openGraphImage{asset->},
    noIndex
  }
}
```

**Hent navigation**

```groq
*[_type == "navigationManager"][0] {
  mainNavigation[]{
    title,
    type,
    type == "internal" => {
      "internalLink": internalLink->{
        _type,
        title,
        slug
      }
    },
    type == "external" => {url},
    newTab
  },
  ctaButton{
    title,
    link->{...}
  },
  footerSections[]{
    sectionTitle,
    sectionType,
    sectionType == "content" => {
      linksAndContent[]{
        _type,
        _type == "link" => {...},
        _type == "richTextObject" => {richText}
      }
    },
    sectionType == "socialMedia" => {
      "socialMedia": *[_type == "socialMediaProfiles"][0]{
        profiles[]{platform, url}
      }
    }
  }
}
```

**Hent artikkel med relatert innhold**

```groq
*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  body,
  image{asset->, altText, hotspot, title, description},
  publishedAt,
  "author": author->{
    name,
    slug,
    role,
    image,
    bio
  },
  "categories": categories[]->{name, slug},
  seo,

  // Relaterte artikler
  "relatedArticles": *[
    _type == "article" &&
    slug.current != $slug &&
    count((categories[]->slug.current)[@ in ^.^.categories[]->slug.current]) > 0
  ] | order(publishedAt desc) [0...3] {
    title,
    slug,
    excerpt,
    image,
    publishedAt
  }
}
```

**Hent collection hub med filtrerte artikler**

```groq
*[_type == "collectionHub" && type == $type][0] {
  _id,
  title,
  description,
  image{asset->, altText},
  allPostsLabel,
  contactSection,

  // Hent alle artikler av denne typen
  "articles": *[_type == "article" && type == ^.type] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    featured,
    categories[]->{name, slug},
    author->{name, slug, image}
  },

  seo
}
```

**Hent settings for SEO fallback**

```groq
{
  "seo": *[_type == "seoFallback"][0].seo,
  "brandAssets": *[_type == "brandAssets"][0]{
    primaryLogo{asset->, altText},
    secondaryLogo{asset->, altText},
    favicon{asset->}
  },
  "companyInfo": *[_type == "companyInformation"][0],
  "socialMedia": *[_type == "socialMediaProfiles"][0].profiles
}
```

### Advanced Queries

**Filtrering og søk**

```groq
*[
  _type == "article" &&
  type == $articleType &&
  (
    // Søk i tittel og excerpt
    title match $searchTerm ||
    excerpt match $searchTerm
  ) &&
  (
    // Filtrer på kategorier
    !defined($category) ||
    $category in categories[]->slug.current
  )
] | order(publishedAt desc) [$from...$to] {
  // ... fields
}
```

**Paginering**

```groq
{
  "items": *[_type == "article"] | order(publishedAt desc) [$from...$to] {
    // ... fields
  },
  "total": count(*[_type == "article"])
}
```

## 🎯 TypeScript Types

TypeScript types er allerede generert fra schemas. For å bruke dem i frontend:

### 1. Kopier genererte types

```bash
# Fra studio repo
cp studio-pmdd-norge/src/types/sanity.types.ts frontend/src/types/
```

Eller generer på nytt:

```bash
# I studio repo
npm run typegen

# Output: src/types/sanity.types.ts
```

### 2. Bruk types i frontend

```typescript
import type { Article, Page, Writer } from "@/types/sanity.types";

// Type-safe query result
const articles: Article[] = await client.fetch<Article[]>(query);

// Type-safe props
interface ArticleCardProps {
  article: Article;
}
```

## 🎨 Best Practices

### 1. Projections

Hent kun feltene du trenger:

```groq
// ❌ Dårlig - henter alt
*[_type == "article"]

// ✅ Bra - henter kun det du trenger
*[_type == "article"] {
  _id,
  title,
  slug,
  excerpt,
  image
}
```

### 2. Resolver References

Bruk `->` for å resolve references:

```groq
*[_type == "article"] {
  title,
  "author": author->{  // Resolve reference
    name,
    image
  }
}
```

### 3. Conditional Fields

Bruk conditional syntax for å unngå null:

```groq
*[_type == "page"] {
  sections[]{
    _type == "contact" && showCompanyInfo == true => {
      "companyInfo": *[_type == "companyInformation"][0]
    }
  }
}
```

### 4. Image URLs

Bruk `@sanity/image-url` for å generere responsive images:

```typescript
import { urlFor } from "@/lib/sanity.client";

// Generer optimized image URL
const imageUrl = urlFor(article.image)
  .width(800)
  .height(600)
  .fit("crop")
  .format("webp")
  .quality(80)
  .url();
```

### 5. Portable Text

Bruk `@portabletext/react` for å rendre PortableText:

```bash
npm install @portabletext/react
```

```typescript
import {PortableText} from '@portabletext/react'

// Custom components
const components = {
  types: {
    image: ({value}) => (
      <Image
        src={urlFor(value).url()}
        alt={value.altText || ''}
        width={800}
        height={600}
      />
    ),
  },
  marks: {
    link: ({children, value}) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

// Render
<PortableText value={article.body} components={components} />
```

### 6. Link Resolver

Lag en utility for å håndtere ulike link-typer:

```typescript
// lib/linkResolver.ts
import type { Link } from "@/types/sanity.types";

export function resolveLink(link: Link): string | null {
  if (!link) return null;

  switch (link.type) {
    case "internal":
      if (!link.internalLink) return null;
      const { _type, slug } = link.internalLink;

      // Map document types to routes
      const routeMap = {
        page: `/${slug.current}`,
        article: `/artikler/${slug.current}`,
        collectionHub: `/samling/${slug.current}`,
        writer: `/team/${slug.current}`,
        resource: `/ressurser/${slug.current}`,
      };

      return routeMap[_type] || `/${slug.current}`;

    case "external":
      return link.url || null;

    case "email":
      return link.email ? `mailto:${link.email}` : null;

    case "phone":
      return link.phone ? `tel:${link.phone}` : null;

    default:
      return null;
  }
}
```

### 7. Caching og Revalidation (Next.js)

```typescript
// app/articles/[slug]/page.tsx
import { client } from "@/lib/sanity.client";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const articles = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "article"] {slug}`
  );

  return articles.map((article) => ({
    slug: article.slug.current,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await client.fetch<Article>(query, { slug: params.slug });
  // ...
}
```

## 📋 Eksempel: Komplett Page Implementation

```typescript
// app/[slug]/page.tsx
import {client, urlFor} from '@/lib/sanity.client'
import type {Page} from '@/types/sanity.types'
import {notFound} from 'next/navigation'

// Sections
import Hero from '@/components/sections/Hero'
import Grid from '@/components/sections/Grid'
import Contact from '@/components/sections/Contact'
// ... other sections

const query = `
*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,
    ...,
    _type == "grid" && lists[].contentType == "writer" => {
      lists[]{
        ...,
        "items": *[_type == "writer"] | order(name asc) {
          _id,
          name,
          role,
          image,
          slug
        }
      }
    }
  },
  seo
}
`

export const revalidate = 60

export async function generateMetadata({params}: {params: {slug: string}}) {
  const page = await client.fetch<Page>(query, {slug: params.slug})

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: {
      images: page.seo?.openGraphImage
        ? [urlFor(page.seo.openGraphImage).width(1200).height(630).url()]
        : [],
    },
    robots: {
      index: !page.seo?.noIndex,
      follow: !page.seo?.noIndex,
    },
  }
}

export default async function PageRoute({params}: {params: {slug: string}}) {
  const page = await client.fetch<Page>(query, {slug: params.slug})

  if (!page) notFound()

  return (
    <main>
      {page.sections?.map((section) => {
        switch (section._type) {
          case 'hero':
            return <Hero key={section._key} data={section} />
          case 'grid':
            return <Grid key={section._key} data={section} />
          case 'contact':
            return <Contact key={section._key} data={section} />
          // ... other sections
          default:
            return null
        }
      })}
    </main>
  )
}
```

## 🔍 Debugging Tips

### 1. Vision Plugin

Studio har Vision plugin installert - bruk den for å teste queries:

- http://localhost:3333/vision

### 2. Pretty Print GROQ

```groq
// Bruk * for å se hele dokumentet
*[_id == "drafts.companyInformation"][0]

// Bruk count for å telle
count(*[_type == "article"])
```

### 3. Check References

```groq
// Se hva som refererer til et dokument
*[references("article-id")]
```

## 📞 Support

Ved spørsmål eller problemer:

- Sjekk [Sanity Documentation](https://www.sanity.io/docs)
- GROQ Query Language: https://www.sanity.io/docs/groq
- Studio Structure: Se `SANITY_ANALYSIS_REPORT.md` i dette repo

## 🔄 Syncing Changes

Når schemas endres i Studio:

1. Regenerer types:

```bash
cd studio-pmdd-norge
npm run typegen
```

2. Kopier til frontend:

```bash
cp src/types/sanity.types.ts ../frontend/src/types/
```

3. Oppdater queries om nødvendig

---

**Lykke til med frontend-integrasjonen! 🚀**
