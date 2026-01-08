# PMDD.no Routing Guide

Complete oversikt over routing-struktur og hvilke komponenter som rendres hvor.

**Sist oppdatert:** November 20, 2025
**Endringer:** Forenklet routing ved å fjerne dupliserte handlers. `information` og `highlights` er nå håndtert som `collectionHub` med `type` felt.

---

## 📁 App Directory Structure

```
src/app/
├── page.tsx                    → / (Landing page)
├── layout.tsx                  → Root layout (wraps all pages)
├── [...slug]/
│   ├── page.tsx               → Catch-all dynamic routing
│   └── contentTypeHandlers.tsx → Content type handlers
├── api/
│   ├── draft-mode/
│   │   ├── enable/route.ts
│   │   └── disable/route.ts
│   ├── revalidate/route.ts
│   └── revalidate-sanity/route.ts
├── robots.ts                   → /robots.txt
└── sitemap.ts                  → /sitemap.xml
```

---

## 🎯 Route Mapping

### 1. Landing Page
**URL:** `/`
**File:** `src/app/page.tsx`
**Renders:** Sections from Sanity CMS
**Query:** `LANDING_PAGE_QUERY`

```typescript
// Dynamically renders sections based on CMS content
<SectionRenderer
  section={section}
  isLandingPage={true}
/>
```

---

### 2. Dynamic Pages (Catch-all)
**URL:** `/*` (any path)
**File:** `src/app/[...slug]/page.tsx`
**Handler:** `contentTypeHandlers.tsx`

#### Content Type → Component Mapping

| Sanity Type | Handler Function | Component | Example URL |
|-------------|------------------|-----------|-------------|
| `page` | `handlePageType` | `<SectionRenderer />` | `/om-oss` |
| `article` | `handleArticleType` | `<ArticlePage />` or `<AvailablePositionPage />` | `/blogg/artikkel-1` |
| `collectionHub` | `handleCollectionHubType` | Varies by hub.type field | `/informasjon`, `/hva-skjer` |
| `event` | `handleEventType` | `<EventPage />` | `/arrangementer/event-1` |
| `availablePosition` | `handleAvailablePositionType` | `<AvailablePositionPage />` | `/ledige-stillinger/stilling-1` |
| `legalDocument` | `handleLegalDocumentType` | `<ArticlePage />` | `/personvern` |

**Note:** `information` and `highlights` are not separate document types. They are `collectionHub` documents with `type: 'blog'` or `type: 'highlights'`.

---

## 🔀 Content Type Handlers (Detail)

### 1. Page Type
**Handler:** `handlePageType`
```typescript
// Renders flexible page with sections from CMS
└─ getDocumentWithLandingCheck(QueryType.Page)
   └─ <SectionRenderer /> for each section
```

**Sections that can render:**
- Hero
- Grid
- Article Section
- Callout
- CTA Section
- Contact
- Features
- Testimonials
- Image
- Quote
- Resources
- Logo Salad

---

### 2. Article Type
**Handler:** `handleArticleType`
```typescript
// Routes based on article.type:
├─ "job-position" → <AvailablePositionPage />
├─ "blog-post" → <ArticlePage />
└─ "news" → <ArticlePage />
```

---

### 3. Collection Hub Type
**Handler:** `handleCollectionHubType`

This is the **primary handler** for all collection/listing pages. CollectionHub documents have a `type` field that determines which component to render.

```typescript
// Routes based on hub.type field:
├─ "blog" → <Information />
│   ├─ Fetches blog-post articles
│   ├─ Categories navigation
│   ├─ Article grid with pagination
│   └─ Optional contact section
│
├─ "news" → <Information />
│   ├─ Fetches news articles
│   ├─ Categories navigation
│   ├─ Article grid with pagination
│   └─ No contact section
│
├─ "highlights" → <Highlights />
│   ├─ Events list (from eventsSection)
│   └─ Available positions (job-position articles)
│
└─ "resources" or other → <SectionRenderer />
    └─ Renders custom page.sections if defined
```

**Search Params (for blog/news types):**
- `?page=1` - Page number
- `?category=slug` - Filter by category

**Examples:**
- `/informasjon` → collectionHub with type: 'blog'
- `/hva-skjer` → collectionHub with type: 'highlights'
- `/ressurser` → collectionHub with type: 'resources'

---

### 4. Event Type
**Handler:** `handleEventType`
```typescript
// Single event page
└─ <EventPage />
   ├─ Event details
   ├─ Date/time
   ├─ Location
   └─ Rich text content
```

---

### 5. Available Position Type
**Handler:** `handleAvailablePositionType`
```typescript
// Job posting page
└─ <AvailablePositionPage />
   ├─ Job title
   ├─ Description
   └─ Application info
```

---

### 6. Legal Document Type
**Handler:** `handleLegalDocumentType`
```typescript
// Legal pages (privacy policy, terms, etc.)
└─ <ArticlePage showQuickNavigation={false} />
   └─ Simplified article view
```

---

## 🎨 Page Components

### Primary Page Components

| Component | Location | Usage |
|-----------|----------|-------|
| `ArticlePage` | `src/components/pages/article/` | Articles, blog posts, news |
| `Information` | `src/components/pages/information/` | Article listings with categories |
| `Highlights` | `src/components/pages/highlights/` | Events + job positions |
| `EventPage` | `src/components/pages/event/` | Single event view |
| `AvailablePositionPage` | `src/components/pages/availablePosition/` | Job posting |
| `Legal` | `src/components/pages/legal/` | Legal documents (unused in current routing) |

### Section Components

| Section Type | Component | Location |
|--------------|-----------|----------|
| `hero` | `<Hero />` | `src/components/sections/hero/` |
| `grid` | `<Grid />` | `src/components/sections/grid/` |
| `articleSection` | `<Article />` | `src/components/sections/article/` |
| `callout` | `<Callout />` | `src/components/sections/callout/` |
| `ctaSection` | `<CallToAction />` | `src/components/sections/callToAction/` |
| `contactSection` | `<Contact />` | `src/components/sections/contact/` |
| `features` | `<Features />` | `src/components/sections/features/` |
| `testimonials` | `<Testimonials />` | `src/components/sections/testimonials/` |
| `image` | `<ImageSection />` | `src/components/sections/imageSection/` |
| `quote` | `<Quote />` | `src/components/sections/quote/` |
| `resources` | `<Resources />` | `src/components/sections/resources/` |
| `logoSalad` | `<LogoSalad />` | `src/components/sections/logoSalad/` |

---

## 🔍 Routing Flow

### Example 1: User visits `/blogg/min-artikkel`

```
1. Next.js matches: src/app/[...slug]/page.tsx
   └─ slug = ["blogg", "min-artikkel"]

2. getDocumentTypeBySlug() queries Sanity
   └─ Returns: "article"

3. contentTypeHandlers["article"] is called
   └─ handleArticleType()

4. getDocumentBySlug(QueryType.Article) fetches article

5. Routes based on article.type:
   ├─ "blog-post" → <ArticlePage article={...} />
   ├─ "job-position" → <AvailablePositionPage />
   └─ "news" → <ArticlePage article={...} />

6. Component renders with article data
```

### Example 2: User visits `/informasjon` (Collection Hub)

```
1. Next.js matches: src/app/[...slug]/page.tsx
   └─ slug = ["informasjon"]

2. getDocumentTypeBySlug() queries Sanity
   └─ Returns: "collectionHub"

3. contentTypeHandlers["collectionHub"] is called
   └─ handleCollectionHubType()

4. getDocumentBySlug(QueryType.CollectionHub) fetches hub document
   └─ hub = { _type: "collectionHub", type: "blog", slug: "informasjon", ... }

5. Routes based on hub.type field:
   ├─ "blog" → Fetches blog-post articles → <Information />
   ├─ "news" → Fetches news articles → <Information />
   ├─ "highlights" → Fetches events + positions → <Highlights />
   └─ other → Renders hub.page.sections → <SectionRenderer />

6. Component renders with hub data and fetched content
```

---

## 📊 Query Type Mapping

**File:** `src/utils/queries.ts`

```typescript
export enum QueryType {
  Page = "page",
  Article = "article",
  Event = "event",
  CollectionHub = "collectionHub",
  AvailablePosition = "availablePosition",
  LegalDocument = "legalDocument"
}
```

Each QueryType maps to specific GROQ queries:
- `PAGE_BY_SLUG_QUERY`
- `ARTICLE_BY_SLUG_QUERY`
- `EVENT_BY_SLUG_QUERY`
- `COLLECTION_HUB_BY_SLUG_QUERY`
- etc.

---

## 🎭 Metadata Generation

All pages use the centralized metadata factory:

```typescript
// src/utils/metadata.ts
export async function generatePageMetadata(slug?: string)
```

**Fetches:**
- Page-specific SEO (if slug provided)
- Fallback SEO settings
- Brand assets (favicon, etc.)

**Returns:**
- title
- description
- openGraph images
- icons
- robots (noIndex if set)

---

## 🔐 API Routes

| Route | Purpose |
|-------|---------|
| `/api/draft-mode/enable` | Enable draft mode for CMS preview |
| `/api/draft-mode/disable` | Disable draft mode |
| `/api/revalidate` | Manual revalidation endpoint |
| `/api/revalidate-sanity` | Webhook for Sanity updates |

---

## ⚡ ISR (Incremental Static Regeneration)

**Revalidation Times:**

| Route | Revalidate | Reason |
|-------|------------|--------|
| `/` (landing) | 43200s (12h) | Less frequent updates |
| `/[...slug]` | 86400s (24h) | Daily regeneration |
| `layout.tsx` | 0s | No cache in dev |

**Configuration:** `src/constants/index.ts`

```typescript
export const REVALIDATION = {
  LANDING_PAGE: 43200,  // 12 hours
  DEFAULT_PAGE: 86400,   // 24 hours
  DEVELOPMENT: 0         // No cache
}
```

---

## 🎯 Error Handling

**Error Component:** `<PMDDErrorMessage />`
**Location:** `src/components/pages/information/components/customErrorMessage/`

**Used when:**
- Document not found
- Invalid document type
- Handler throws error
- Invalid slug

**Error Boundary:** `src/components/errors/ErrorBoundary.tsx`
- Catches React errors
- Shows fallback UI
- Logs errors in development

---

## 📱 Middleware

**File:** `src/middleware.ts`

**Purpose:**
- Static redirects
- Path matching
- Request interception

**Example:**
```typescript
STATIC_REDIRECTS = {
  "/informasjon-om-pmdd": { to: "/informasjon", type: 301 }
}
```

---

## 🚦 Routing Best Practices

### Adding a New Content Type

1. **Add to constants:**
```typescript
// src/constants/index.ts
export const CONTENT_TYPES = {
  // ... existing
  NEW_TYPE: "newType",
}
```

2. **Create handler:**
```typescript
// src/app/[...slug]/contentTypeHandlers.tsx
export async function handleNewType(
  slug: string[],
  language: string,
  _searchParams?: SearchParams
): Promise<ReactElement> {
  // Implementation
}
```

3. **Register handler:**
```typescript
export const contentTypeHandlers = {
  // ... existing
  newType: handleNewType,
}
```

4. **Add QueryType (if needed):**
```typescript
// src/utils/queries.ts
export enum QueryType {
  // ... existing
  NewType = "newType"
}
```

---

## 🎨 Styling

Each page component typically has:
- Dedicated CSS module (`.module.css`)
- Scoped styles
- Dynamic className with `cn()` utility

**Example:**
```typescript
import styles from './article.module.css';
import { cn } from '@/utils/cn';

<div className={cn(styles.container, isActive && styles.active)} />
```

---

## 📝 Summary

### Key Points
1. **Single entry point:** `[...slug]/page.tsx` handles all dynamic routes
2. **Handler registry:** Type-safe routing via `contentTypeHandlers`
3. **Component reuse:** Sections can be used in multiple page types
4. **Centralized metadata:** One factory for all pages
5. **Type safety:** TypeScript + constants ensure correctness
6. **ISR enabled:** Static generation with periodic regeneration

### Architecture Benefits
- ✅ Easy to add new content types
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Type-safe routing
- ✅ Centralized error handling
- ✅ Consistent metadata

---

**Last Updated:** November 19, 2025
