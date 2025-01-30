import { defineField } from "sanity";
import image from "./media";

export const appearanceId = "appearance";
export const themeId = "theme";
export const imagePositionId = "imagePosition";
export const layoutId = "layout";
export const linkTypeId = "linkType";

export enum ColorTheme {
  Light = "light",
  Dark = "dark",
}

export enum LinkType {
  linkButton = "linkButton",
  Link = "link",
}

export enum ImagePosition {
  Left = "left",
  Right = "right",
}

export const colorTheme = defineField({
  name: "theme",
  title: "Color Theme",
  type: "string",
  options: {
    list: [
      { title: "Light background", value: ColorTheme.Light },
      { title: "Dark background", value: ColorTheme.Dark },
    ],
    layout: "radio",
  },
  initialValue: ColorTheme.Light,
});

export const linkType = defineField({
  name: linkTypeId,
  title: "Link Type",
  type: "string",
  options: {
    list: [
      { title: "Link", value: LinkType.Link },
      { title: "Link Button", value: LinkType.linkButton },
    ],
    layout: "radio",
  },
  initialValue: LinkType.Link,
});

export const imagePosition = defineField({
  name: imagePositionId,
  title: "Image Position",
  type: "string",
  options: {
    list: [
      { title: "Left of content", value: ImagePosition.Left },
      { title: "Right of content", value: ImagePosition.Right },
    ],
    layout: "radio",
  },
  initialValue: ImagePosition.Left,
});

export const layout = defineField({
  name: layoutId,
  title: "Layout",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [imagePosition],
});

export const appearance = defineField({
  name: appearanceId,
  title: "Visual Settings",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [colorTheme, linkType, image, layout],
});

export const createAppearance = ({
  includeImage = true,
  includeLayout = true,
  includeTheme = true,
  includeLink = true,
} = {}) => {
  return defineField({
    name: appearanceId,
    title: "Visual Settings",
    type: "object",
    options: {
      collapsible: true,
      collapsed: false,
    },
    fields: [
      ...(includeTheme ? [colorTheme] : []),
      ...(includeLink ? [linkType] : []),
      ...(includeImage ? [image] : []),
      ...(includeLayout ? [layout] : []),
    ],
  });
};
