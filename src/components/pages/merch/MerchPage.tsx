import Image from "next/image";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { ShopifyProduct, formatPrice } from "@/utils/shopify";
import CartLink from "@/components/cart/CartLink";
import styles from "./merch.module.css";

interface MerchPageProps {
  products: ShopifyProduct[];
  title?: string;
  richText?: PortableTextBlock[];
  hubSlug?: string;
}

const MerchPage = ({
  products,
  title,
  richText,
  hubSlug = "nettbutikk",
}: MerchPageProps) => {
  return (
    <>
      <div className="sectionWrapperColumn">
        {title && <Text type="h1">{title}</Text>}
        {richText && <RichText value={richText} />}
        <CartLink />
      </div>

      <div className="darkBackground">
        <div className={styles.wrapper}>
          {products.length === 0 ? (
            <Text type="body">
              Ingen produkter tilgjengelig for øyeblikket.
            </Text>
          ) : (
            // role="list" er nødvendig for at Safari + VoiceOver skal beholde
            // liste-semantikk når list-style er fjernet med CSS
            <ul className={styles.grid} role="list">
              {products.map((product) => {
                const image = product.images.edges[0]?.node;
                const price = formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode,
                );
                const productUrl = `/${hubSlug}/${product.handle}`;

                return (
                  <li key={product.id}>
                    <article className={styles.card}>
                      {/* Bildet er dekorativt — tittelen formidler innholdet */}
                      {image && (
                        <div className={styles.imageWrapper} aria-hidden="true">
                          <Image
                            src={image.url}
                            alt=""
                            fill
                            className={styles.image}
                            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className={styles.content}>
                        {/* h3 > a er riktig — ikke a > h3 */}
                        <Text type="h3">
                          <Link href={productUrl} className={styles.titleLink}>
                            {product.title}
                          </Link>
                        </Text>
                        <Text type="bodyLarge">
                          <span className="sr-only">Pris: </span>
                          {price}
                        </Text>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MerchPage;
