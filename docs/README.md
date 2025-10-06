📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Shipping Option Components

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

> ⚠️ The Shipping Option Components app is available only for stores using [Delivery Promises](https://help.vtex.com/en/tutorial/delivery-promise-beta--p9EJH9GgxL0JceA6dBswd). This feature is in closed beta, which means that only selected customers can access it. If you are interested in implementing it in the future, please contact our [Support](https://support.vtex.com/hc/en-us) team.
>
> For more information on setting up Delivery Promise components on Store Framework, see the [developer documentation](https://developers.vtex.com/docs/guides/setting-up-delivery-promise-components).

The Shipping Option Components app exports a component that aims to allow you to filter store products by location or pickup point.

![Media Placeholder](https://github.com/user-attachments/assets/6f334e28-fd01-42e9-a536-64eb9742e70c)

## Configuration

### Adding the Shipping Option Components app to your theme dependencies

Add the `shipping-option-components` app to your theme dependencies in the `manifest.json` as shown below:

```json
  "dependencies": {
    "vtex.shipping-option-components": "1.x"
  }
```

You can now use all blocks exported by the `shipping-option-components` app. See the full list below:

| Block name                          | Description                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `shipping-option-location-selector` | Renders a set of components that allow users to add their location and/or select a store for pickup. |

### Adding Shipping Option Components blocks to the theme

Declare the `shipping-option-location-selector` block as a child block of your [header](https://developers.vtex.com/docs/apps/vtex.store-header) block, exported by the `store-header` app. Example:

```json
"header.full": {
   "blocks": ["header-layout.desktop", "header-layout.mobile"]
 },

 "header-layout.desktop": {
   "children": [
     "header-row#1-desktop",
   ]
 },

 "header-row#1-desktop": {
   "children": ["shipping-option-location-selector"],
 },

"shipping-option-location-selector": {
  "props": {
    "compactMode": true,
  }
},
```

#### `shipping-option-location-selector` props

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `callToAction` | `enum` | Defines the type of overlay that opens when the page loads. Possible values: `modal` (modal that requires a postal code input), `popover-input` (popover for postal code input), `popover-button` (popover that opens with a button). | `popover-input`|
| `compactMode` | `boolean` | Determines whether the button displays its label. When true, the label is hidden, showing only its value. | `false` |
| `dismissible` | `boolean` | Controls whether the modal can be dismissed without entering a postal code. When set to `false`, the modal cannot be closed until a postal code is entered.	 Must be used along with `callToAction` to correctly set a blocking modal. | `true` |
| `shippingSelection` | `enum` | Defines the type of shipping option selector to be shown. Possible values: `delivery-and-pickup` (shows both options), `only-pickup` (shows only the pickup store selector).  | `undefined` |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles                       |
| --------------------------------- |
| `buttonLabel`                     |
| `buttonValue`                     |
| `buttonWrapper`                   |
| `deliveryModalButtonLabel`        |
| `deliveryModalButtonLabelLimited` |
| `deliveryModalButton`             |
| `deliveryPopover`                 |
| `noPickupsStateContent`           |
| `pickupItem`                      |
| `pickupItemSelected`              |
| `popoverInputContainer`           |
| `popoverPolygon`                  |
| `popoverPolygonContainer`         |
| `popoverPolygonSvg`               |
| `postalCodeHelpLink`              |
| `postalCodeInputClearButton`      |
| `postalCodeInputContainer`        |
| `shippingButtonContainer`         |
| `shippingMethodModalOptions`      |
| `shippingOptionButton`            |
| `shippingOptionButtonSelected`    |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
