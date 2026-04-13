export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProductDetail extends ShopifyProduct {
  descriptionHtml: string;
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
  options: Array<{ name: string; values: string[] }>;
  metafields: Array<ShopifyMetafield | null>;
}

const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($collectionId: ID!) {
    collection(id: $collectionId) {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      availableForSale
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 5) {
        edges { node { url altText } }
      }
      options {
        name
        values
      }
      variants(first: 30) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "materiale" },
        { namespace: "custom", key: "material" },
        { namespace: "custom", key: "innhold" },
        { namespace: "custom", key: "vekt" },
        { namespace: "custom", key: "dimensjoner" },
        { namespace: "custom", key: "mal" },
        { namespace: "custom", key: "farge" },
        { namespace: "custom", key: "storrelse" },
        { namespace: "custom", key: "spesifikasjoner" },
        { namespace: "descriptors", key: "subtitle" },
        { namespace: "descriptors", key: "care_guide" },
        { namespace: "global", key: "material" },
        { namespace: "global", key: "harmonized_system_code" }
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

async function shopifyFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error('Missing Shopify environment variables');
  }

  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  return res.json();
}

export async function getMerchProducts(): Promise<ShopifyProduct[]> {
  const json = await shopifyFetch<{
    data: { collection: { products: { edges: Array<{ node: ShopifyProduct }> } } };
  }>(COLLECTION_PRODUCTS_QUERY, {
    collectionId: 'gid://shopify/Collection/499373736183',
  });

  return (json.data?.collection?.products?.edges ?? []).map(({ node }) => node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const json = await shopifyFetch<{
    data: { product: ShopifyProductDetail | null };
  }>(PRODUCT_BY_HANDLE_QUERY, { handle });

  return json.data?.product ?? null;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    image: { url: string; altText: string | null } | null;
    product: { title: string; handle: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: { edges: Array<{ node: CartLine }> };
  cost: { totalAmount: { amount: string; currencyCode: string } };
}

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
  cost { totalAmount { amount currencyCode } }
`;

async function shopifyCartFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) throw new Error('Missing Shopify environment variables');

  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  return res.json();
}

export async function createCart(variantId: string, quantity: number): Promise<ShopifyCart> {
  const json = await shopifyCartFetch<{
    data: { cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> } };
  }>(
    `mutation cartCreate($variantId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { variantId, quantity }
  );
  const { cart, userErrors } = json.data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

export async function addCartLine(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const json = await shopifyCartFetch<{
    data: { cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> } };
  }>(
    `mutation cartLinesAdd($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { cartId, variantId, quantity }
  );
  const { cart, userErrors } = json.data.cartLinesAdd;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const json = await shopifyCartFetch<{
    data: { cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> } };
  }>(
    `mutation cartLinesUpdate($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { cartId, lineId, quantity }
  );
  const { cart, userErrors } = json.data.cartLinesUpdate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const json = await shopifyCartFetch<{
    data: { cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> } };
  }>(
    `mutation cartLinesRemove($cartId: ID!, $lineId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { cartId, lineId }
  );
  const { cart, userErrors } = json.data.cartLinesRemove;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const json = await shopifyCartFetch<{
    data: { cart: ShopifyCart | null };
  }>(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }`,
    { cartId }
  );
  return json.data?.cart ?? null;
}

// ── Pris ──────────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}
