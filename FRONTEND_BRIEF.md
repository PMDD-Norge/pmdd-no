# Sanity Studio - Frontend Brief

## 📌 Kontekst

Jeg har nettopp fullført **oppdatering og refaktorering** av Sanity Studio for PMDD Norge. Det finnes et gammelt frontend-repo som må oppdateres til det nye Studio-oppsettet.

**⚠️ VIKTIG ARKITEKTUR-ENDRING:**

- **GAMMELT:** Studio og frontend lå i **samme monorepo**
- **NYTT:** Studio er nå **isolert i eget repo** (`studio-pmdd-norge/`)
- **FRONTEND:** Må separeres og ryddes for gamle Studio-dependencies

**⚠️ BREAKING CHANGES:** Se `MIGRATION_GUIDE.md` for fullstendig liste over breaking changes og migrasjonssteg.

## 🎯 Sanity Prosjektinfo

```
Project ID: e7m3wa6s
Dataset: production
API Version: 2024-01-01
Studio URL: https://pmdd-norge.sanity.studio/
```

## 📚 Viktigste Schemas

### Content Types

- **`article`** - Artikler (blog-post, news, job-position)
- **`page`** - Sider med seksjoner (page builder)
- **`collectionHub`** - Samlesider for artikler/ressurser
- **`resource`** - Nedlastbare ressurser
- **`event`** - Arrangementer
- **`writer`** - Team medlemmer/forfattere
- **`category`** - Kategorier

### Settings (Singletons)

- **`navigationManager`** - Navigasjon og footer
- **`brandAssets`** - Logoer
- **`seoFallback`** - Standard SEO
- **`socialMediaProfiles`** - Sosiale medier
- **`companyInformation`** - Org info

### Sections (for page builder)

- `hero`, `grid`, `callout`, `contact`, `article`, `features`, `testimonials`, `image`, `quote`, `resources`, `logoSalad`

## 🗂️ Studio Struktur

```
src/
├── schemaTypes/
│   ├── documents/        # Alle document types (flat)
│   ├── objects/
│   │   └── sections/     # Page builder sections
│   ├── fields/           # Gjenbrukbare felt
│   ├── validators/       # Sentraliserte validators
│   ├── utils/            # Fieldsets
│   └── types/            # Preview types
├── types/
│   └── sanity.types.ts   # 🔥 Auto-genererte TypeScript types
└── ...
```

## ✨ Viktige Features

### 1. **Type-safe queries**

TypeScript types er generert fra schemas → `src/types/sanity.types.ts`

### 2. **Flat dokumentstruktur**

Alle documents er i flat struktur (ikke nøstet) - optimalisert for utviklere

### 3. **Sentraliserte validators**

Norske org.nummer, telefon, email validering

### 4. **Norsk språk**

All UI-tekst er på norsk

### 5. **Grid med auto-populate**

Grid-seksjoner kan automatisk hente team members, events, artikler, etc.

## 🔧 Hva jeg trenger hjelp med

1. **Setup av Sanity Client** i Next.js frontend
2. **GROQ queries** for å hente innhold
3. **Page builder implementation** - rendre sections dynamisk
4. **Navigation** - hente og rendre meny fra Sanity
5. **SEO** - bruke SEO metadata fra Sanity
6. **Image optimization** - bruke Sanity's image CDN
7. **PortableText** - rendre rich text content
8. **Link resolver** - håndtere internal/external links

## 📄 Dokumentasjon

Full dokumentasjon ligger i `FRONTEND_INTEGRATION.md` som inkluderer:

- Alle schema-definisjoner
- GROQ query eksempler
- Setup instruksjoner
- TypeScript types
- Best practices
- Komplette kodeeksempler

## 🚀 Neste Steg

1. Les `FRONTEND_INTEGRATION.md` for komplett oversikt
2. Setup Sanity client i frontend
3. Start med å hente og vise en enkel side
4. Bygg ut page builder med alle sections
5. Implementer navigation og SEO

---

**La oss komme i gang! 🎉**
