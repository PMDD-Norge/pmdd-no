"use client";
import { useClient, useFormValue } from "sanity";
import { Button } from "@sanity/ui";
import { apiVersion } from "../env";

interface ClearLinkFieldsButtonProps {
  path: Array<string | { _key: string }>;
}

const ClearLinkFieldsButton = ({ path }: ClearLinkFieldsButtonProps) => {
  const documentId = useFormValue(["_id"]) as string;
  const client = useClient({ apiVersion: apiVersion });

  const isObjectWithKey = (
    item: string | { _key: string }
  ): item is { _key: string } => {
    return typeof item === "object" && "_key" in item;
  };

  const constructFieldPaths = (
    path: Array<string | { _key: string }>
  ): string[] => {
    if (!isObjectWithKey(path[1]) || !isObjectWithKey(path[3])) return [];

    const sectionKey = path[1]._key;
    const ctaKey = path[3]._key;
    const basePath = `sections[_key=="${sectionKey}"].callToActions[_key=="${ctaKey}"]`;

    return [
      `${basePath}.internalLink`,
      `${basePath}.title`,
      `${basePath}.url`,
      `${basePath}.type`,
      `${basePath}.anchor`,
      `${basePath}.newTab`,
    ];
  };

  const resetFields = async () => {
    try {
      const fieldPaths = constructFieldPaths(path);
      if (fieldPaths.length === 0) {
        console.error("Invalid field path");
        return;
      }

      const patch = client.patch(documentId).unset(fieldPaths);
      await patch.commit();
      console.log("Call to action fields cleared successfully");
    } catch (error) {
      console.error("Error clearing call to action fields:", error);
    }
  };

  return (
    <Button
      mode="ghost"
      text="Clear Link Fields"
      onClick={resetFields}
      tone="critical"
    />
  );
};

export default ClearLinkFieldsButton;
