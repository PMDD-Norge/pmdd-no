import { PortableTextBlock } from "sanity";
import { PortableTextSpan, PortableTextTextBlock } from "sanity";

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
    .filter((block): block is PortableTextTextBlock => block.style === "h2")
    .map((block) =>
      block.children
        .filter((child): child is PortableTextSpan => child._type === "span")
        .map((span) => span.text)
        .join("")
    );
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
