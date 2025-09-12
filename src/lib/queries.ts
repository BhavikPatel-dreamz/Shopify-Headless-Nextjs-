// Centralized GraphQL queries for Shopify Storefront API

export const QUERY_ALL_PRODUCTS = /* GraphQL */ `
  query AllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        title
        description
        featuredImage { url altText width height }
        images(first: 10) { nodes { url altText width height } }
        options { name values }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            sku
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText width height }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

export const QUERY_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      featuredImage { url altText width height }
      images(first: 20) { nodes { url altText width height } }
      options { name values }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          sku
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
          selectedOptions { name value }
        }
      }
    }
  }
`;

export const QUERY_SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!, $after: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        handle
        title
        description
        featuredImage { url altText width height }
      }
    }
  }
`;

export const QUERY_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query CollectionByHandle($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText width height }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          handle
          title
          description
          featuredImage { url altText width height }
        }
      }
    }
  }
`;

export const MUTATION_CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                availableForSale
                price { amount currencyCode }
                image { url altText width height }
                product { id handle title featuredImage { url altText width height } }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const MUTATION_CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity checkoutUrl }
      userErrors { field message }
    }
  }
`;

export const MUTATION_CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity checkoutUrl }
      userErrors { field message }
    }
  }
`;

export const QUERY_CART = /* GraphQL */ `
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } }
      lines(first: 100) {
        nodes {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price { amount currencyCode }
              image { url altText width height }
              product { id handle title featuredImage { url altText width height } }
            }
          }
        }
      }
    }
  }
`;

export const MUTATION_CUSTOMER_ACCESS_TOKEN_CREATE = /* GraphQL */ `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { field message }
    }
  }
`;

export const MUTATION_CUSTOMER_ACCESS_TOKEN_DELETE = /* GraphQL */ `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors { field message }
    }
  }
`;

export const QUERY_CUSTOMER = /* GraphQL */ `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress { id address1 address2 city country zip }
      addresses(first: 20) {
        nodes { id address1 address2 city country zip }
      }
      orders(first: 10) {
        nodes {
          id
          orderNumber
          processedAt
          totalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 50) {
            nodes {
              title
              quantity
              originalTotalPrice { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

export const MUTATION_CUSTOMER_CREATE = /* GraphQL */ `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { field message }
    }
  }
`;

export const MUTATION_CUSTOMER_RECOVER = /* GraphQL */ `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { field message }
    }
  }
`;

export const MUTATION_CUSTOMER_RESET = /* GraphQL */ `
  mutation CustomerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer { id email }
      customerUserErrors { field message }
    }
  }
`;

export const MUTATION_CUSTOMER_ADDRESS_CREATE = /* GraphQL */ `
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerUserErrors { field message }
      customer { id }
    }
  }
`;

export const MUTATION_CUSTOMER_ADDRESS_DELETE = /* GraphQL */ `
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors { field message }
      deletedCustomerAddressId
    }
  }
`;

export const MUTATION_CUSTOMER_DEFAULT_ADDRESS_UPDATE = /* GraphQL */ `
  mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customerUserErrors { field message }
      customer { id }
    }
  }
`;


