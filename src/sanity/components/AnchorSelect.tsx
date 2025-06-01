"use client";
import React, { useState, useEffect } from "react";
import { PatchEvent, SchemaType, set, unset, useFormValue } from "sanity";
import { Select, Button, Stack } from "@sanity/ui";
import { client } from "../lib/client";

interface AnchorSelectProps {
  value?: string;
  type: SchemaType;
  onChange: (event: PatchEvent) => void;
  path: string[];
  schemaType: SchemaType;
}

interface InternationalizedString {
  _type: "internationalizedArrayStringValue";
  _key: string;
  value: string;
}

interface AnchorItem {
  title?: InternationalizedString[] | string;
  value: string;
  _type?: string;
  _key?: string;
}

interface FormattedAnchorItem {
  title: string;
  value: string;
}

// Helper function to get the title in the default language (assuming 'en')
function getLocalizedTitle(
  title: InternationalizedString[] | string | undefined
): string {
  if (!title) return "";

  if (typeof title === "string") return title;

  if (Array.isArray(title)) {
    const defaultLang = title.find((t) => t._key === "en");
    if (defaultLang) return defaultLang.value;

    // Fallback to first available translation if 'en' is not found
    return title[0]?.value || "";
  }

  return "";
}

const AnchorSelect = ({ value, onChange, path }: AnchorSelectProps) => {
  const [listItems, setListItems] = useState<FormattedAnchorItem[]>([]);

  const internalLink = useFormValue([...path.slice(0, -1), "internalLink"]) as {
    _ref?: string;
  };

  const fetchSections = async (internalLinkRef?: string) => {
    if (!internalLinkRef) {
      setListItems([]);
      return;
    }

    try {
      const response = await client.fetch<{
        sections: AnchorItem[];
      }>("*[_id == $id][0]{sections[]{_key, title}}", {
        id: internalLinkRef,
      });

      const formattedResponseToListItems = response.sections?.map(
        (section: AnchorItem): FormattedAnchorItem => ({
          title: getLocalizedTitle(section.title),
          value: `#${section._key}`,
        })
      ) || [];

      setListItems(formattedResponseToListItems);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setListItems([]);
    }
  };

  useEffect(() => {
    fetchSections(internalLink?._ref);
  }, [internalLink?._ref]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange(PatchEvent.from(selectedValue ? set(selectedValue) : unset()));
  };

  const handleReset = () => {
    onChange(PatchEvent.from(unset()));
  };

  return (
    <div>
      <Stack space={3}>
        <Select onChange={handleChange} value={value || ""}>
          <option value="" disabled>
            Select a section
          </option>
          {listItems.map((item) => (
            <option key={item.value} value={item.value}>
              {item.title} {/* Now guaranteed to be a string */}
            </option>
          ))}
        </Select>
        {value && <Button text="Reset" tone="critical" onClick={handleReset} />}
      </Stack>
    </div>
  );
};

export default AnchorSelect;
