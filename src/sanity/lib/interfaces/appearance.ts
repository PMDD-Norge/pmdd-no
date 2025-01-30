import {
  ColorTheme,
  ImagePosition,
  LinkType,
} from "@/sanity/schemaTypes/fields/appearance";
import { imageProps } from "./media";

export interface Appearance {
  theme: ColorTheme;
  linkType: LinkType;
  image: imageProps;
  layout: {
    imagePosition: ImagePosition;
  };
}
