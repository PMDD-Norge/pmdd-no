import { PortableTextBlock } from "next-sanity";
import { PortableTextSpan } from "@portabletext/types";

/**
 * Extracts all h2 text content from a PortableText block.
 * @param portableText - The PortableText block array
 * @returns Array of text content from h2 blocks
 */
export function extractH2TextsFromPortableText(
  portableText: PortableTextBlock[]
): string[] {
  if (!Array.isArray(portableText)) {
    throw new Error("portableText must be an array");
  }

  return portableText
    .filter((block) => block.style === "h2")
    .map((block) => {
      const children = block.children as unknown as PortableTextSpan[];
      return (children || [])
        .filter((child) => child._type === "span")
        .map((span) => span.text)
        .join("");
    });
}

/**
 * Formats a string as a hash link.
 * Ensures the resulting string does not start with a hyphen (-).
 * @param heading - The text to format
 * @returns The formatted hash link
 */
export function generateHashFromHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/^-+/, ""); // Remove leading hyphens
}

export const truncateText = (text: string, length: number) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trimEnd()}...` : text;
};

// Helper function to safely extract string from potentially internationalized content
interface InternationalizedItem {
  _key?: string;
  language?: string;
  value?: string;
}

export const getDisplayText = (text: string | InternationalizedItem[] | unknown): string => {
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) {
    // Try to find English or first available translation
    const enText = text.find((item: InternationalizedItem) => item._key === 'en' || item.language === 'en');
    if (enText?.value) return enText.value;
    // Fallback to first item with value
    const firstText = text.find((item: InternationalizedItem) => item.value);
    if (firstText?.value) return firstText.value;
  }
  return '';
};
