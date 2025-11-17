# Migreringsguide - Gammelt til Nytt Sanity Studio

Dette dokumentet beskriver endringer fra gammelt Studio-oppsett til det nye, og hvordan du migrerer frontend-koden.

## 🏗️ KRITISK: Arkitektur-endring (Monorepo → Separate Repos)

### Gammelt Oppsett

```
gammelt-repo/
├── studio/              # Sanity Studio
│   ├── schemas/
│   ├── sanity.config.ts
│   └── package.json (Studio dependencies)
├── app/                 # Next.js frontend
│   ├── components/
│   ├── lib/
│   └── ...
└── package.json         # Både Studio OG frontend dependencies
```

**Problem:**

- Studio og frontend dependencies blandet sammen
- Gamle Sanity-pakker som kanskje ikke er oppdatert
- Vanskelig å vedlikeholde og deploye separat

### Nytt Oppsett

```
studio-pmdd-norge/      # 🆕 ISOLERT Studio-repo
├── src/
│   ├── schemaTypes/
│   ├── types/
│   │   └── sanity.types.ts  # Generated types
│   └── sanity.config.ts
└── package.json         # KUN Studio dependencies

frontend-repo/           # Ryddet frontend (kun frontend)
├── app/
├── components/
├── lib/
│   ├── sanity.client.ts
│   └── queries/
└── package.json         # KUN frontend dependencies
```

### Hva betyr dette for migreringen?

1. **Fjern Studio-kode fra frontend-repo**

   - Slett `studio/` mappen (hvis den eksisterer)
   - Studio er nå i eget repo

2. **Rydd opp i package.json**

   ```bash
   # FJERN disse Studio-spesifikke pakkene fra frontend:
   npm uninstall sanity @sanity/vision @sanity/desk-tool @sanity/default-layout

   # BEHOLD kun disse Sanity-pakkene i frontend:
   npm install @sanity/client@latest @sanity/image-url@latest
   npm install --save-dev @sanity/types@latest
   ```

3. **Kopier genererte types**

   ```bash
   # Fra studio-repo til frontend-repo:
   cp ../studio-pmdd-norge/src/types/sanity.types.ts ./types/sanity.types.ts
   ```

4. **Oppdater import paths**
   - Ingen lokale schema-imports lenger
   - Alt hentes via Sanity Client og GROQ queries

## 🔄 Hva har endret seg

### Overordnede Endringer

1. ✅ **Fullstendig norsk språk** - All UI-tekst er nå på norsk
2. ✅ **Flat dokumentstruktur** - Fjernet nesting i schemaTypes
3. ✅ **Sentraliserte validators** - Gjenbrukbare valideringsfunksjoner
4. ✅ **Type-safe** - Genererte TypeScript types
5. ✅ **Modularisert** - Grid og andre komplekse schemas er splittet opp
6. ✅ **Utilities** - Fieldsets, preview helpers, constants

### Prosjektkonfigurasjon

**INGEN ENDRINGER** - Prosjekt-ID og dataset er det samme:

```
Project ID: e7m3wa6s (UENDRET)
Dataset: production (UENDRET)
API Version: 2024-01-01 (oppdatert fra tidligere versjon)
```

## 📋 Schema Endringer

### Document Types

#### ✅ Beholdt (med mindre endringer)

**`article`**

- ✅ Samme struktur
- ⚠️ Feltnavne på norsk i UI
- ✅ `type` field: `'blog-post' | 'news' | 'job-position'` (samme)

**`page`**

- ✅ Samme struktur
- ✅ Sections array uendret

**`category`**

- ✅ Samme struktur

**`writer`**

- ✅ Samme struktur
- 📁 Flyttet fra `editorial/information/writer` → `documents/writer`

**`event`**

- ✅ Samme struktur
- 📁 Flyttet fra `editorial/highlights/event` → `documents/event`

#### ❌ Fjernet / Slått sammen

**`post`** ❌

- Slått sammen med `article`
- Migrering: Alle `post` dokumenter må konverteres til `article` med type `'blog-post'`

**`availablePosition`** ❌

- Slått sammen med `article`
- Migrering: Konverter til `article` med type `'job-position'`

**`highlights`** ❌

- Fjernet som egen type
- Migrering: Bruk `collectionHub` med type `'highlights'`

**`information`** ❌

- Fjernet som egen type
- Migrering: Bruk `collectionHub` med type `'blog'`

**`globalTranslations`** ❌

- Fjernet (prosjektet er kun norsk)

#### 🆕 Nye Document Types

**`collectionHub`**

- Erstatter: `highlights`, `information`
- Typer: `'blog' | 'news' | 'highlights' | 'resources'`
- Brukes for samlesider

**`resource`**

- Ny type for nedlastbare ressurser
- Støtter: PDF, video, link, guide

**`redirect`**

- Ny type for URL-videresendinger

#### 🔄 Settings Endringer

**Omdøpt:**

- `siteSettings/*` → Direkte i `documents/`
- Alle singleton settings har samme `_id`

**Struktur beholdt:**

- `brandAssets` ✅
- `navigationManager` ✅
- `seoFallback` ✅
- `socialMediaProfiles` ✅
- `companyInformation` ✅ (tidligere `companyInfo`)

### Objects / Sections

#### Grid Section - VIKTIG ENDRING

**Gammelt:**

```typescript
{
  _type: 'grid'
  items: GridItem[]  // Kun manual items
}
```

**Nytt:**

```typescript
{
  _type: 'grid'
  lists: GridList[]  // Kan ha flere lister
}

// GridList kan være:
{
  contentType: 'manual' | 'writer' | 'event' | 'blog-post' | 'news' | 'job-position'

  // Hvis manual:
  items: GridItem[]

  // Hvis auto (f.eks 'writer'):
  // Items hentes automatisk fra Sanity
}
```

**Migrering:**

```groq
// GAMMELT
*[_type == "page"] {
  sections[]{
    _type == "grid" => {
      items[]{ ... }
    }
  }
}

// NYTT
*[_type == "page"] {
  sections[]{
    _type == "grid" => {
      lists[]{
        title,
        contentType,

        // Manual items
        contentType == "manual" => {
          items[]{ ... }
        },

        // Auto-populated
        contentType == "writer" => {
          "items": *[_type == "writer"] | order(name asc) {
            _id, name, role, image, slug
          }
        }
      }
    }
  }
}
```

#### Andre Sections

**Uendret:**

- `hero` ✅
- `callout` ✅
- `contact` ✅
- `article` ✅
- `features` ✅
- `testimonials` ✅
- `image` ✅
- `quote` ✅
- `logoSalad` ✅

**Nye:**

- `resources` 🆕
- `callToAction` 🆕

## 🗂️ Mappestruktur Endringer

### Gammelt (antatt struktur)

```
schemaTypes/
├── documents/
│   ├── editorial/
│   │   ├── highlights/
│   │   │   ├── event.ts
│   │   │   └── availablePosition.ts
│   │   ├── information/
│   │   │   ├── post.ts
│   │   │   ├── category.ts
│   │   │   └── writer.ts
│   │   └── highlights.ts
│   ├── admin/
│   │   └── companyInformation.ts
│   ├── siteSettings/
│   │   └── ...
│   └── page.ts
└── objects/
    └── sections/
        └── ...
```

### Nytt

```
src/schemaTypes/
├── documents/              # FLAT struktur
│   ├── article.ts          # Erstatter post + availablePosition
│   ├── collectionHub.ts    # Erstatter highlights + information
│   ├── resource.ts         # NY
│   ├── event.ts
│   ├── category.ts
│   ├── writer.ts
│   ├── page.ts
│   ├── brandAssets.ts
│   ├── navigationManager.ts
│   └── ...
├── objects/
│   ├── sections/
│   │   ├── grid/           # MODULARISERT
│   │   │   ├── constants.ts
│   │   │   ├── gridItem.ts
│   │   │   ├── gridList.ts
│   │   │   └── index.ts
│   │   └── ...
│   └── ...
├── validators/             # NY
│   └── common.ts
├── utils/                  # NY
│   └── fieldsets.ts
├── types/                  # NY
│   └── preview.ts
└── constants/              # NY
    └── schemaNames.ts
```

## 🔧 Migrering av Frontend Code

### Steg 0: Repo-separasjon (KRITISK - GJØR FØRST!)

**Før du gjør noe annet, må du rydde i repo-strukturen:**

1. **Slett Studio-mappen (hvis den eksisterer):**

   ```bash
   # I frontend-repo
   rm -rf studio/  # eller sanity-studio/ eller hva den heter
   ```

2. **Rydd opp i package.json:**

   ```bash
   # FJERN gamle Studio-pakker
   npm uninstall sanity @sanity/vision @sanity/desk-tool @sanity/default-layout

   # Sjekk package.json manuelt for andre Studio-relaterte pakker og fjern dem
   ```

3. **Verifiser at frontend fortsatt bygger:**

   ```bash
   npm run dev
   # Hvis du får errors om manglende imports fra studio/, fjern disse importene
   ```

4. **Commit endringene:**
   ```bash
   git add .
   git commit -m "chore: remove Studio code, isolate frontend"
   ```

**NÅ er du klar for å koble til det nye Studio-repoet.**

---

### Steg 1: Installer nye Dependencies

```bash
# Installer KUN de nødvendige Sanity-pakkene for frontend
npm install @sanity/client@latest @sanity/image-url@latest
npm install --save-dev @sanity/types@latest
```

### Steg 2: Oppdater API Version

```env
# .env.local
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01  # Oppdater fra gammel versjon
```

### Steg 3: Oppdater Queries

#### 3.1 Article Queries (erstatter post queries)

**GAMMELT:**

```groq
*[_type == "post"] {
  _id,
  title,
  slug,
  // ...
}
```

**NYTT:**

```groq
*[_type == "article" && type == "blog-post"] {
  _id,
  title,
  slug,
  type,
  // ...
}
```

#### 3.2 Collection Hub (erstatter highlights/information)

**GAMMELT:**

```groq
*[_type == "highlights"][0] {
  title,
  "posts": *[_type == "event"] | order(startDate desc)
}
```

**NYTT:**

```groq
*[_type == "collectionHub" && type == "highlights"][0] {
  title,
  description,
  "posts": *[_type == "event"] | order(startDate desc)
}
```

#### 3.3 Grid Section

**GAMMELT:**

```groq
sections[]{
  _type == "grid" => {
    items[]{
      title,
      description,
      image,
      link
    }
  }
}
```

**NYTT:**

```groq
sections[]{
  _type == "grid" => {
    lists[]{
      title,
      contentType,

      // Manual items
      contentType == "manual" => {
        items[]{
          title,
          description,
          image,
          link
        }
      },

      // Auto-populated writers
      contentType == "writer" => {
        "items": *[_type == "writer"] {
          _id,
          name,
          role,
          image,
          slug
        }
      },

      // Auto-populated events
      contentType == "event" => {
        "items": *[_type == "event"] | order(startDate desc) {
          _id,
          title,
          startDate,
          image,
          slug
        }
      }
    }
  }
}
```

#### 3.4 Navigation - Ingen endring nødvendig

```groq
// Dette fungerer fortsatt
*[_type == "navigationManager"][0] {
  mainNavigation[]{...},
  ctaButton{...},
  footerSections[]{...}
}
```

### Steg 4: Oppdater Type Imports

**Kopier nye types:**

```bash
# Fra studio repo
cp studio-pmdd-norge/src/types/sanity.types.ts frontend/src/types/
```

**Oppdater imports:**

```typescript
// GAMMELT
import type { Post, Highlights } from "@/types/sanity";

// NYTT
import type { Article, CollectionHub } from "@/types/sanity.types";
```

### Steg 5: Oppdater Komponenter

#### Grid Component

**GAMMELT:**

```tsx
// components/Grid.tsx
interface GridProps {
  items: GridItem[];
}

export function Grid({ items }: GridProps) {
  return (
    <div className="grid">
      {items.map((item) => (
        <GridItem key={item._key} {...item} />
      ))}
    </div>
  );
}
```

**NYTT:**

```tsx
// components/sections/Grid.tsx
interface GridProps {
  lists: GridList[];
}

export function Grid({ lists }: GridProps) {
  return (
    <div className="grid-container">
      {lists.map((list) => (
        <div key={list._key} className="grid-list">
          {list.title && <h2>{list.title}</h2>}

          <div className="grid">
            {list.items?.map((item) => (
              <GridItem key={item._id || item._key} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Article/Post Component

**GAMMELT:**

```tsx
// components/PostCard.tsx
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <h2>{post.title}</h2>
      {/* ... */}
    </article>
  );
}
```

**NYTT:**

```tsx
// components/ArticleCard.tsx
interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Håndter ulike article types
  const typeLabel =
    {
      "blog-post": "Blogginnlegg",
      news: "Nyhet",
      "job-position": "Ledig stilling",
    }[article.type] || "";

  return (
    <article>
      {typeLabel && <span className="type">{typeLabel}</span>}
      <h2>{article.title}</h2>
      {/* ... */}
    </article>
  );
}
```

### Steg 6: Oppdater Routing

**GAMMELT:**

```
/posts/[slug]           → Blogginnlegg
/stillinger/[slug]      → Jobbannonser
/aktuelt/[slug]         → Events
```

**NYTT (foreslått):**

```
/artikler/[slug]        → Alle artikler (blog, news, jobs)
/arrangementer/[slug]   → Events
/ressurser/[slug]       → Ressurser (ny)
/team/[slug]            → Team members
```

Eller behold gamle routes og bruk article.type:

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await client.fetch<Article>(
    `*[_type == "article" && type == "blog-post" && slug.current == $slug][0]`,
    { slug: params.slug }
  );
  // ...
}
```

## 📝 Data Migration Script

Hvis du har eksisterende data i Sanity:

```typescript
// scripts/migrate-data.ts
import { client } from "@/lib/sanity.client";

async function migratePostsToArticles() {
  // Hent alle gamle posts
  const posts = await client.fetch(`*[_type == "post"]`);

  for (const post of posts) {
    // Opprett ny article
    await client.create({
      _type: "article",
      type: "blog-post",
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      image: post.image,
      publishedAt: post.publishedAt,
      categories: post.categories,
      author: post.author,
      featured: post.featured,
      seo: post.seo,
    });

    // Slett gammel post (valgfritt - gjør backup først!)
    // await client.delete(post._id)
  }

  console.log(`Migrerte ${posts.length} posts til articles`);
}

// Kjør: ts-node scripts/migrate-data.ts
```

## ✅ Sjekkliste for Migrering

### Studio (allerede gjort ✅)

- [x] Oppdatert alle schemas
- [x] Flat dokumentstruktur
- [x] Sentraliserte validators
- [x] Norsk språk overalt
- [x] Type generation setup

### Frontend (TODO)

#### 0. Repo-separasjon (KRITISK FØRSTE STEG)

- [ ] **Slett `studio/` mappen** fra frontend-repo (hvis den eksisterer)
- [ ] **Rydd package.json:**
  - [ ] Fjern `sanity` (Studio-pakken)
  - [ ] Fjern `@sanity/vision`
  - [ ] Fjern `@sanity/desk-tool`
  - [ ] Fjern `@sanity/default-layout`
  - [ ] Fjern andre gamle Studio-relaterte pakker
- [ ] **Verifiser at frontend fortsatt kjører** (kan ha broken imports som må fikses)

#### 1. Setup nye Sanity Client dependencies

- [ ] Installer `@sanity/client@latest`
- [ ] Installer `@sanity/image-url@latest`
- [ ] Installer `@sanity/types@latest` (devDependencies)
- [ ] Oppdater API version i .env til `2024-01-01`

#### 2. Kopier genererte types

- [ ] Kopier `src/types/sanity.types.ts` fra studio-repo
- [ ] Plasser i frontend `types/` eller `lib/types/`

#### 3. Oppdater GROQ queries

- [ ] Article queries (erstatt post)
- [ ] CollectionHub queries (erstatt highlights/information)
- [ ] Grid queries (ny struktur med lists)
- [ ] Navigation queries (uendret, men verifiser)

#### 4. Oppdater komponenter

- [ ] Grid component (støtte lists med auto-populate)
- [ ] PostCard → ArticleCard
- [ ] Nye components for resource, collectionHub

#### 5. Oppdater routing (hvis nødvendig)

- [ ] Verifiser at alle routes fungerer
- [ ] Oppdater paths hvis nødvendig

#### 6. Testing og data

- [ ] Test alle sider
- [ ] Verifiser at alle GROQ queries returnerer data
- [ ] Migrer eksisterende data (hvis nødvendig)

## 🚨 Breaking Changes Oppsummering

1. **🏗️ ARKITEKTUR:** Monorepo → Separate repos (Studio isolert)
2. **📦 DEPENDENCIES:** Rydd ut gamle Studio-pakker fra frontend
3. **`post` → `article`** med `type` field
4. **`availablePosition` → `article`** med `type: 'job-position'`
5. **`highlights`/`information` → `collectionHub`**
6. **Grid:** `items` → `lists[].items` med auto-populate
7. **Mappestruktur:** Flat i stedet for nested (Studio)
8. **API version:** Oppdater til `2024-01-01`

## 📞 Support

Ved problemer under migrering:

- Sjekk `FRONTEND_INTEGRATION.md` for komplette schema-definisjoner
- Bruk Vision plugin i Studio for å teste queries
- Sammenlign gamle og nye queries side-by-side

---

**Lykke til med migreringen! 🚀**
