"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Text from "@/components/text/Text";
import Button from "@/components/buttons/Button";
import {
  ShopifyProductDetail,
  ShopifyVariant,
  formatPrice,
} from "@/utils/shopify";
import { useCart } from "@/components/cart/CartContext";
import CartLink from "@/components/cart/CartLink";
import styles from "./product.module.css";
import linkStyles from "@/components/link/link.module.css";

const ProductPage = ({ product }: { product: ShopifyProductDetail }) => {
  const { openCart, setCart } = useCart();
  const variants = product.variants.edges.map(({ node }) => node);
  const hasSizeOption = product.options.some(
    (o) =>
      o.name.toLowerCase() === "size" || o.name.toLowerCase() === "størrelse",
  );

  const firstAvailable =
    variants.find((v) => v.availableForSale) ?? variants[0];
  const [selectedVariant, setSelectedVariant] =
    useState<ShopifyVariant>(firstAvailable);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = product.images.edges.map(({ node }) => node);
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<"next" | "prev">("next");
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goToImage(index: number, dir: "next" | "prev") {
    if (index === activeImage) return;
    if (slideTimer.current) clearTimeout(slideTimer.current);
    setSlideDir(dir);
    setPrevImage(activeImage);
    setActiveImage(index);
    slideTimer.current = setTimeout(() => setPrevImage(null), 350);
  }

  const sizeOption = product.options.find(
    (o) =>
      o.name.toLowerCase() === "size" || o.name.toLowerCase() === "størrelse",
  );

  async function handleAddToCart() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nettbutikk/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selectedVariant.id, quantity }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Noe gikk galt. Prøv igjen.");
        return;
      }

      setCart(data.cart);
      openCart();
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={styles.wrapper}>
      {/* ── Bildekolonne ── */}
      {/* aria-roledescription="carousel" følger WAI-ARIA APG carousel pattern */}
      <section
        className={styles.imageColumn}
        aria-roledescription="carousel"
        aria-label="Produktbilder"
      >
        {/* Skjult live-region: annonserer bildebytte for skjermlesere */}
        {images.length > 1 && (
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            Bilde {activeImage + 1} av {images.length}
          </div>
        )}

        {/* role="group" + aria-roledescription="slide" på hvert slide per APG */}
        <div
          className={styles.mainImageWrapper}
          role="group"
          aria-roledescription="slide"
          aria-label={`Bilde ${activeImage + 1} av ${images.length}`}
        >
          {/* Utgående bilde — glir ut mens det nye glir inn */}
          {prevImage !== null && images[prevImage] && (
            <div
              className={`${styles.slideWrapper} ${
                slideDir === "next"
                  ? styles.slideOutToLeft
                  : styles.slideOutToRight
              }`}
              aria-hidden="true"
            >
              <Image
                src={images[prevImage].url}
                alt=""
                fill
                className={styles.mainImage}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Inngående bilde — key tvinger remount slik at animasjonen spilles på nytt */}
          {images[activeImage] && (
            <div
              key={activeImage}
              className={`${styles.slideWrapper} ${
                prevImage !== null
                  ? slideDir === "next"
                    ? styles.slideFromRight
                    : styles.slideFromLeft
                  : ""
              }`}
            >
              <Image
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? product.title}
                fill
                className={styles.mainImage}
                sizes="(max-width: 767px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {images.length > 1 && (
            <div className={styles.carouselControls} aria-hidden="true">
              <button
                className={styles.carouselButton}
                onClick={() => goToImage(Math.max(0, activeImage - 1), "prev")}
                disabled={activeImage === 0}
                aria-label="Forrige bilde"
                aria-hidden="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={styles.carouselButton}
                onClick={() =>
                  goToImage(
                    Math.min(images.length - 1, activeImage + 1),
                    "next",
                  )
                }
                disabled={activeImage === images.length - 1}
                aria-label="Neste bilde"
                aria-hidden="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <ul className={styles.thumbnails} role="list">
            {images.map((img, i) => (
              <li key={i}>
                <button
                  className={`${styles.thumbnail} ${i === activeImage ? styles.thumbnailActive : ""}`}
                  onClick={() =>
                    goToImage(i, i > activeImage ? "next" : "prev")
                  }
                  aria-label={`${img.altText ? `${img.altText}, ` : ""}bilde ${i + 1} av ${images.length}`}
                  aria-pressed={i === activeImage}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className={styles.thumbnailImage}
                    sizes="80px"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Detaljkolonne ── */}
      <div className={styles.detailColumn}>
        <Link
          href="/nettbutikk"
          className={`${linkStyles.link} ${styles.backLink}`}
        >
          Tilbake til nettbutikken
        </Link>

        <Text type="h1" className={styles.productTitle}>
          {product.title}
        </Text>

        {/* aria-live på wrapper — Text rendrer <p> og støtter ikke egne aria-props */}
        <div aria-live="polite" aria-atomic="true">
          <Text type="bodyLarge">
            <span className="sr-only">Pris: </span>
            {formatPrice(
              selectedVariant.price.amount,
              selectedVariant.price.currencyCode,
            )}
          </Text>
        </div>

        {product.description && <Text type="body">{product.description}</Text>}

        {sizeOption && (
          <div
            className={styles.optionGroup}
            role="group"
            aria-labelledby="size-option-label"
          >
            <Text id="size-option-label">Størrelse</Text>
            <div className={styles.sizeButtons}>
              {sizeOption.values.map((value) => {
                const variant = variants.find((v) =>
                  v.selectedOptions.some(
                    (o) => o.name === sizeOption.name && o.value === value,
                  ),
                );
                const unavailable = variant ? !variant.availableForSale : true;
                const isSelected = selectedVariant.selectedOptions.some(
                  (o) => o.value === value,
                );

                return (
                  <button
                    key={value}
                    className={`${styles.sizeButton} ${isSelected ? styles.sizeButtonActive : ""} ${unavailable ? styles.sizeButtonUnavailable : ""}`}
                    onClick={() => variant && setSelectedVariant(variant)}
                    disabled={unavailable}
                    aria-pressed={isSelected}
                  >
                    {value}
                    {unavailable && (
                      <span className="sr-only"> (ikke tilgjengelig)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!hasSizeOption && variants.length > 1 && (
          <div
            className={styles.optionGroup}
            role="group"
            aria-labelledby="variant-option-label"
          >
            <Text id="variant-option-label">Variant</Text>
            <div className={styles.sizeButtons}>
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`${styles.sizeButton} ${selectedVariant.id === variant.id ? styles.sizeButtonActive : ""} ${!variant.availableForSale ? styles.sizeButtonUnavailable : ""}`}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.availableForSale}
                  aria-pressed={selectedVariant.id === variant.id}
                >
                  {variant.title}
                  {!variant.availableForSale && (
                    <span className="sr-only"> (ikke tilgjengelig)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Antall — skjules når varianten er utsolgt */}
        {selectedVariant.availableForSale && (
          <div
            className={styles.quantityRow}
            role="group"
            aria-labelledby="quantity-label"
          >
            <Text id="quantity-label">Antall</Text>
            <div className={styles.quantityControls}>
              <button
                id="quantity-decrease"
                className={styles.quantityButton}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reduser antall"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4.16602 9.99731H15.8295"
                    stroke="currentColor"
                    strokeWidth="1.66622"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {/* <output> er semantisk riktig element for resultatet av brukerinteraksjon */}
              <output
                htmlFor="quantity-decrease quantity-increase"
                className={styles.quantityValue}
                aria-live="polite"
              >
                {quantity}
              </output>
              <button
                id="quantity-increase"
                className={styles.quantityButton}
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Øk antall"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4.16602 9.99731H15.8295"
                    stroke="currentColor"
                    strokeWidth="1.66622"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.99805 4.16553V15.829"
                    stroke="currentColor"
                    strokeWidth="1.66622"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* role="alert" sørger for at feil annonseres umiddelbart av skjermleser */}
        {error && (
          <p role="alert" className={styles.errorMessage}>
            {error}
          </p>
        )}

        <div className={styles.addToCartWrapper}>
          {!selectedVariant.availableForSale && (
            <Text type="small">
              Dette produktet er ikke tilgjengelig for øyeblikket.
            </Text>
          )}
          <Button
            size="small"
            type="primary"
            onClick={handleAddToCart}
            disabled={loading || !selectedVariant.availableForSale}
            loading={loading}
            ariaBusy={loading}
            showChevron={false}
          >
            {loading
              ? "Legger i handlekurv…"
              : !selectedVariant.availableForSale
                ? "Utsolgt"
                : "Legg i handlekurv"}
          </Button>
          <CartLink />
        </div>
      </div>
    </article>
  );
};

export default ProductPage;
