import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { defaultLanguage, languages } from "./supportedLanguages";

const locales = languages.map((language) => language.id);
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: defaultLanguage.id,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
