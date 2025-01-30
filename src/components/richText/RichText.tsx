import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";
import React from "react";
import textStyles from "../text/text.module.css";
import styles from "./richtext.module.css";
import SanityImage from "../image/sanityImage";
import Text from "../text/Text";

const formatId = (text: string): string => {
  return text
    ? text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : `section-${Math.random().toString(36).substr(2, 9)}`;
};

const isImageBlock = (
  block: PortableTextBlock
): block is PortableTextBlock & { asset: { _ref: string } } => {
  return (
    block?._type === "image" &&
    typeof block === "object" &&
    block !== null &&
    "asset" in block &&
    typeof block.asset === "object" &&
    block.asset !== null &&
    "_ref" in block.asset &&
    typeof block.asset._ref === "string"
  );
};

const richTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => {
      const id =
        typeof children === "string"
          ? formatId(children)
          : formatId(children?.toString() || "");
      return (
        <Text type="h2" id={id} className={styles.heading}>
          {children}
        </Text>
      );
    },
    h3: ({ children }) => {
      const id =
        typeof children === "string"
          ? formatId(children)
          : formatId(children?.toString() || "");
      return (
        <Text type="h3" id={id} className={styles.subheading}>
          {children}
        </Text>
      );
    },
    normal: ({ children }) => (
      <Text type="body" className={styles.paragraph}>
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
      return (
        <a
          href={href}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className={styles.link}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
  },
};

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
}

export const RichText = ({ value }: RichTextProps) => {
  if (!value || !Array.isArray(value)) return null;

  // Group blocks into sections and subsections
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSubsection: Subsection | null = null;

  value.forEach((block) => {
    if (block?._type === "block") {
      interface TextChild {
        text?: string;
        [key: string]: any;
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
              children: [{ text: "" }],
              _key: "initial",
            },
            content: [block],
            subsections: [],
          };
          sections.push(currentSection);
        }
      }
    } else {
      // Handle non-block content (images, etc.) by creating new section for images
      if (block._type === "image") {
        const imageSection = {
          header: {
            _type: "block",
            style: "normal",
            children: [{ text: "" }],
            _key: `image-section-${block._key || Math.random().toString(36).substr(2, 9)}`, // Generate unique key
            markDefs: [],
          },
          content: [block],
          subsections: [],
        };
        sections.push(imageSection);
        // Reset current section and subsection to continue with the previous context
        currentSection = sections[sections.length - 2] || null;
      } else if (currentSubsection) {
        currentSubsection.content.push(block);
      } else if (currentSection) {
        currentSection.content.push(block);
      }
    }
  });

  return sections.map((section, index) => (
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
