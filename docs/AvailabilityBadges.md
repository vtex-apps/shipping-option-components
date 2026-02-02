>📢 **Disclaimer** Don't fork this project. Use it, [contribute](https://github.com/vtex-apps/shipping-option-components) to help us evolve it. 

# Availability Badges

The `availability-badges` block displays availability badges for product delivery and pickup.

> ℹ️ Delivery availability is defined per product, meaning each item is evaluated individually and can offer Shipping, Pickup, both, or neither.

![image](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-store-components-infocard-0.png)

## Before you begin

Ensure you have the [Delivery Promise](https://developers.vtex.com/docs/guides/setting-up-delivery-promise-components) feature active in your store.

## Installation

To use the `availability-badges` block, install the `shipping-option-components` app:

1. In your terminal, login to your account.
2. Install the app by running `vtex install shipping-option-components@1.x`.

## Configuration

After installing the app, add the `availability-badges` block to your theme's templates.

1. In the `manifest.json` file, add the `shipping-option-components` as a dependency:

```json
  "dependencies": {
    "shipping-option-components": "1.x"

  }
```

2. In the `product-summary.shelf` component, add the `availability-badges` block:

```json
  "product-summary.shelf": {
    "children": [
      "availability-badges"
    ]
  }
```

> ℹ️ This block doesn't require any props to be configured. It automatically retrieves delivery information from the `ProductSummaryContext` and `useShippingOptionState`.

## Customization

To apply CSS customizations to this and other blocks, please see the [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization) guide.

| CSS Handles                   |
| ----------------------------- |
| `availabilityBadgeCircle`     |
| `availabilityPickupButton`    |
