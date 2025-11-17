# Migreringsguide: Fra flerspråklig til norsk-only

Dette scriptet migrerer eksisterende Sanity-innhold fra det gamle flerspråklige formatet til det nye norsk-only formatet.

## Hva gjør scriptet?

Scriptet konverterer:

**Før (flerspråklig):**
```json
{
  "title": [
    {
      "_key": "no",
      "_type": "internationalizedArrayStringValue",
      "value": "Foreningen"
    }
  ],
  "slug": [
    {
      "_key": "no",
      "_type": "internationalizedArrayStringValue",
      "value": "foreningen"
    }
  ]
}
```

**Etter (norsk-only):**
```json
{
  "title": "Foreningen",
  "slug": {
    "current": "foreningen",
    "_type": "slug"
  }
}
```

## Sikkerhet

⚠️ **VIKTIG:** Scriptet gjør permanente endringer i databasen!

### Før du kjører:

1. **Ta backup av Sanity-datasettet:**
   ```bash
   cd ../studio-pmdd-norge
   npx sanity dataset export production backup-before-migration.tar.gz
   ```

2. **Test på en kopi først (anbefalt):**
   - Opprett et test-dataset i Sanity
   - Kopier data til test-datasettet
   - Kjør migreringen på test-datasettet
   - Verifiser at alt ser riktig ut

## Slik kjører du migreringen

### Steg 1: Installer avhengigheter
```bash
npm install @sanity/client dotenv
```

### Steg 2: Sjekk .env.local
Kontroller at disse variablene er satt:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="e7m3wa6s"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN_DEV="din-token-her"
```

### Steg 3: Dry-run (anbefalt)
Først, test uten å gjøre endringer:
```bash
node migrate-content-dry-run.js
```

Dette viser hva som vil bli endret uten å faktisk endre noe.

### Steg 4: Kjør migreringen
```bash
node migrate-content.js
```

## Hva migreres?

Scriptet migrerer disse dokumenttypene:
- `page` - Sider
- `post` - Gamle blogginnlegg (konverteres til `article`)
- `article` - Artikler
- `event` - Arrangementer
- `highlights` - Høydepunkter
- `information` - Informasjonssider
- `collectionHub` - Samlingshub
- `legalDocument` - Juridiske dokumenter
- `availablePosition` - Ledige stillinger

## Hvilke felter konverteres?

Alle internasjonaliserte felter blir konvertert til norsk:
- `title` - Tittel
- `slug` - URL-vennlig slug
- `name` - Navn
- `description` - Beskrivelse
- `altText` - Alt-tekst for bilder
- `caption` - Bildetekst
- `richText` - Rik tekst (PortableText)
- `body` - Brødtekst
- `subtitle` - Undertittel
- `lead` - Ingress
- `excerpt` - Utdrag

## Etter migreringen

1. **Verifiser i Sanity Studio:**
   ```bash
   cd ../studio-pmdd-norge
   npm run dev
   ```

   Sjekk at sidene ser riktige ut.

2. **Test frontenden:**
   ```bash
   cd ../pmdd-no
   npm run dev
   ```

   Gå til http://localhost:3000 og verifiser at innholdet vises.

3. **Hvis noe gikk galt:**
   ```bash
   cd ../studio-pmdd-norge
   npx sanity dataset import backup-before-migration.tar.gz production
   ```

## Feilsøking

### "Cannot read properties of undefined"
- Sjekk at `.env.local` har riktige verdier
- Kontroller at API-tokenet har skrivetilgang

### "Rate limit exceeded"
- Scriptet venter 100ms mellom hver oppdatering
- Hvis du får denne feilen, øk ventetiden i scriptet

### Noen dokumenter feilet
- Sjekk terminalen for hvilke dokumenter som feilet
- Disse kan migreres manuelt i Sanity Studio

## Manuell migrering (alternativ)

Hvis scriptet ikke fungerer, kan du migrere manuelt:

1. Åpne Sanity Studio
2. For hver side/dokument:
   - Åpne dokumentet
   - Kopier norsk tekst fra internasjonaliserte felter
   - Lim inn i de nye feltene
   - Publiser

## Støtte

Hvis du trenger hjelp:
1. Sjekk feilmeldingen i terminalen
2. Verifiser at Sanity-tokenet er gyldig
3. Test med dry-run først
