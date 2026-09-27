import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { PortableTextBlock } from "next-sanity";
import React from "react";
import textStyles from "../text/text.module.css";
import styles from "./richtext.module.css";
import SanityImage from "../image/sanityImage";
import Text, { TextType } from "../text/Text";
import { isExternalLink } from "@/utils/linkUtils";
import { generateHashFromHeading } from "@/utils/textUtils";

const extractTextFromBlock = (value: PortableTextBlock): string => {
  const children = value.children as Array<{ _type: string; text: string }>;
  return (children || [])
    .filter((c) => c._type === "span")
    .map((c) => c.text)
    .join("");
};

const isImageBlock = (
  block: PortableTextBlock
): block is PortableTextBlock & { asset: { _ref: string }; _key: string } => {
  return (
    block?._type === "image" &&
    typeof block === "object" &&
    block !== null &&
    "asset" in block &&
    typeof block.asset === "object" &&
    block.asset !== null &&
    "_ref" in block.asset &&
    typeof block.asset._ref === "string" &&
    "_key" in block &&
    typeof block._key === "string"
  );
};

const buildRichTextComponents = (
  paragraphType: TextType,
  smallerHeadings: boolean
): Partial<PortableTextReactComponents> => ({
  block: {
    h2: ({ children, value }) => {
      const id = generateHashFromHeading(extractTextFromBlock(value));
      return (
        <Text
          type={smallerHeadings ? "h3" : "h2"}
          as="h2"
          id={id}
          className={styles.heading}
        >
          {children}
        </Text>
      );
    },
    h3: ({ children, value }) => {
      const id = generateHashFromHeading(extractTextFromBlock(value));
      return (
        <Text
          type={smallerHeadings ? "h4" : "h3"}
          as="h3"
          id={id}
          className={styles.subheading}
        >
          {children}
        </Text>
      );
    },
    normal: ({ children }) => (
      <Text type={paragraphType} className={styles.paragraph}>
        {children}
      </Text>
    ),
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={textStyles.body}>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!isImageBlock(value)) return null;
      return <SanityImage image={value} className={styles.image} />;
    },
  },
  marks: {
    link: ({ value, children }) => {
      const { href, blank } = value;
      const isExternal = isExternalLink(href);
      const openInNewTab = blank === true;

      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className={isExternal ? styles.externalLink : styles.internalLink}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
  },
});

interface Subsection {
  header: PortableTextBlock;
  content: PortableTextBlock[];
}

interface Section {
  header: PortableTextBlock;
  content: PortableTextBlock[];
  subsections: Subsection[];
}

interface RichTextProps {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
  paragraphType?: TextType;
  smallerHeadings?: boolean;
  flat?: boolean;
}

export const RichText = ({
  value,
  paragraphType = "body",
  smallerHeadings = false,
  flat = false,
}: RichTextProps) => {
  if (!value || !Array.isArray(value)) return null;

  const richTextComponents = buildRichTextComponents(
    paragraphType,
    smallerHeadings
  );

  if (flat) {
    return (
      <div className={styles.section}>
        <PortableText value={value} components={richTextComponents} />
      </div>
    );
  }

  // Group blocks into sections and subsections
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSubsection: Subsection | null = null;

  value.forEach((block) => {
    if (block?._type === "block") {
      interface TextChild {
        text?: string;
        [key: string]: string | string[] | undefined;
      }

      const getFirstChildText = (
        block: PortableTextBlock
      ): string | undefined => {
        const children = block.children as TextChild[];
        return children?.[0]?.text;
      };

      // Check if it's an h2 header (either by style or content starting with §)
      const isH2 =
        block.style === "h2" ||
        (getFirstChildText(block)?.startsWith("§") &&
          !getFirstChildText(block)?.includes("§3"));

      // Check if it's an h3 header
      const isH3 =
        block.style === "h3" || getFirstChildText(block)?.startsWith("§3");

      if (isH2) {
        // Start a new main section
        currentSection = {
          header: block,
          content: [],
          subsections: [],
        };
        sections.push(currentSection);
        currentSubsection = null;
      } else if (isH3 && currentSection) {
        // Start a new subsection within current section
        currentSubsection = {
          header: block,
          content: [],
        };
        currentSection.subsections.push(currentSubsection);
      } else {
        // Regular content block
        if (currentSubsection) {
          currentSubsection.content.push(block);
        } else if (currentSection) {
          currentSection.content.push(block);
        } else {
          // Create initial section if none exists
          currentSection = {
            header: {
              _type: "block",
              style: "normal",
              children: [{ _type: "span", text: "" }],
              _key: "initial",
              markDefs: [],
            },
            content: [block],
            subsections: [],
          };
          sections.push(currentSection);
        }
      }
    } else {
      // Non-block content (images, etc.) is treated like any other content block
      // so it stays in the correct position relative to surrounding text.
      if (currentSubsection) {
        currentSubsection.content.push(block);
      } else if (currentSection) {
        currentSection.content.push(block);
      } else {
        currentSection = {
          header: {
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: "" }],
            _key: `initial-${block._key || Math.random().toString(36).slice(2, 11)}`,
            markDefs: [],
          },
          content: [block],
          subsections: [],
        };
        sections.push(currentSection);
      }
    }
  });

  return sections?.map((section, index) => (
    <div
      key={`section-${section.header._key || index}`}
      className={styles.section}
    >
      {section.header.style !== "normal" && (
        <PortableText
          value={[section.header]}
          components={richTextComponents}
        />
      )}

      <PortableText value={section.content} components={richTextComponents} />

      {section.subsections.map((subsection, subIndex) => (
        <div
          key={`subsection-${subsection.header._key || subIndex}`}
          className={styles.subSection}
        >
          <PortableText
            value={[subsection.header]}
            components={richTextComponents}
          />
          <PortableText
            value={subsection.content}
            components={richTextComponents}
          />
        </div>
      ))}
    </div>
  ));
};
