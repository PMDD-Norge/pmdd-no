import { imageProps } from "./media";

// Local enum definitions (schemas removed from frontend)
export enum ColorTheme {
  Light = "light",
  Dark = "dark",
}

export enum ImagePosition {
  Left = "left",
  Right = "right",
}

export enum LinkType {
  Internal = "internal",
  External = "external",
  Email = "email",
  Phone = "phone",
}

export interface Appearance {
  theme: ColorTheme;
  linkType: LinkType;
  image: imageProps;
  layout: {
    imagePosition: ImagePosition;
  };
}
