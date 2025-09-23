>📢 **Disclaimer** Don't fork this project. Use it, [contribute](https://github.com/vtex-apps/shipping-option-components) to help us evolve it. 

# Availability Badges


The `availability-badges` block displays availability badges for product delivery and pickup.


![image](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-store-components-infocard-0.png)

## Configuration

1. Import the `shipping-option-components` app to your theme's dependencies in the manifest.json file as in the following example:

```json
  "dependencies": {
    "shipping-option-components": "1.x"

  }
```

2. Add the `availability-badges` block to the `product-summary.shelf` component. For example:

```json
  "product-summary.shelf": {
    "children": [
      "availability-badges"
    ]
  }
```

### Props

Although this block does not have explicit props, it uses the `ProductSummaryContext` and `useShippingOptionState` to retrieve delivery information.


## Customization

To apply CSS customizations to this and other blocks, please see the [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization) guide.

| CSS Handles                   |
| ----------------------------- |
| `availabilityBadgeCircle`     |
| `availabilityPickupButton`    |

## Notes
- Delivery availability is defined at the product level.
- Each product may or may not have each delivery method (Shipping and Pickup).
- The store must be regionalized for the component to work correctly.
