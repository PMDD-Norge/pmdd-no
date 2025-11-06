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
    return imageBuilder
      .image(source)
      .auto("format") // Automatically serves WebP/AVIF when supported
      .fit("crop")
      .quality(85); // Slightly lower for better compression
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

  // Use Sanity's image metadata or fallback to responsive defaults
  // Hotspot dimensions are relative (0-1), not absolute pixels
  const width = 1920; // Default responsive width
  const height = 1080; // Default responsive height

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
