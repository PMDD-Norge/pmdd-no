"use client";
import React, { useEffect, useState } from "react";
import { useClient, PatchEvent, set, unset } from "sanity";
import { TextInput } from "@sanity/ui";
import { apiVersion } from "../env";

interface ReferenceSlugInputProps {
  value?: string;
  readOnly?: boolean;
  schemaType: {
    title: string;
    name: string;
    description?: string;
  };
  onChange: (event: PatchEvent) => void;
  renderDefault: (props: {
    value?: string;
    readOnly?: boolean;
    schemaType: { title: string; name: string; description?: string };
    onChange: (event: PatchEvent) => void;
    elementProps: {
      id: string;
      ref: React.Ref<HTMLInputElement>;
      onBlur: () => void;
      onFocus: () => void;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    };
    document: { internalLink?: { _ref: string } };
  }) => React.ReactNode;
  elementProps: {
    id: string;
    ref: React.Ref<HTMLInputElement>;
    onBlur: () => void;
    onFocus: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  document: {
    internalLink?: {
      _ref: string;
    };
  };
}

const ReferenceSlugInput = (props: ReferenceSlugInputProps) => {
  const { value, readOnly, onChange, elementProps, document } = props;
  const [slug, setSlug] = useState<string | null>(value || null);
  const client = useClient({
    apiVersion: apiVersion,
  });

  useEffect(() => {
    if (document?.internalLink?._ref) {
      client
        .fetch<
          string | null
        >("*[_id == $id][0].slug.current", { id: document.internalLink._ref })
        .then((fetchedSlug) => {
          setSlug(fetchedSlug || null);
          onChange(PatchEvent.from(fetchedSlug ? set(fetchedSlug) : unset()));
        });
    }
  }, [document?.internalLink?._ref, client, onChange]);

  return (
    <TextInput
      {...elementProps}
      value={slug || ""}
      readOnly={readOnly}
      onChange={(event) => {
        setSlug(event.currentTarget.value);
        onChange(
          PatchEvent.from(
            event.currentTarget.value ? set(event.currentTarget.value) : unset()
          )
        );
      }}
    />
  );
};

export default ReferenceSlugInput;
