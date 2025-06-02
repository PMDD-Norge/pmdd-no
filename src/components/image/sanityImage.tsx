import { client } from "@/sanity/lib/client";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
import createImageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

const imageBuilder = createImageUrlBuilder(client);

interface ImageProps {
  image: SanityImageData;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

const urlFor = (source: SanityImageData) => {
  // Handle Sanity asset
  if (source.asset?._ref) {
    return imageBuilder.image(source).auto("format").fit("crop").quality(90);
  }

  return null;
};

export default function SanityNextImage({
  image,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw",
}: ImageProps) {
  // Handle Sanity asset case
  const imageUrl = urlFor(image)?.url();
  console.log(imageUrl);
  if (!imageUrl) {
    return null;
  }

  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "50% 50%";

  // TODO: FIX HOTSPOT
  // Calculate reasonable dimensions based on expected usage - higher for better quality
  const width = image.hotspot?.width || 1920;
  const height = image.hotspot?.height || 1080;

  return (
    <Image
      src={imageUrl}
      alt={image.altText || image.title || ""}
      title={image.title || undefined}
      className={className}
      priority={priority}
      style={{
        objectFit: "cover",
        objectPosition,
        width: "100%",
        height: "100%",
      }}
      width={width}
      height={height}
      quality={90}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
    />
  );
}
