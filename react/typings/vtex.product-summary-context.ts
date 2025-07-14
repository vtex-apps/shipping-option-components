declare module 'vtex.product-summary-context' {
  export const ProductSummaryContext: {
    useProductSummary: () => {
      product: Product
    }
  }
}

type Product = {
  deliveryPromisesBadges?: BadgeItem[]
}

type BadgeItem = {
  typeName: string
  pickupId: string
  pickupName: string
}
