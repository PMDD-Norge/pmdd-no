import { SanityBase } from "./base";

// Local enum definition (schemas removed from frontend)
export enum ImageAlignment {
  Left = "left",
  Center = "center",
  Right = "right",
}

interface Hotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface Crop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SanityImageData extends SanityBase {
  asset?: {
    _ref: string;
    _type?: string;
  };
  crop?: Crop;
  hotspot?: Hotspot;
  title?: string;
  altText?: string;
  description?: string;
  credits?: string;
}

export interface imageProps extends SanityImageData {
  imageAlignment: ImageAlignment;
}
