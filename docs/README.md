📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it, or open issues to help evolve it through [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Shipping Option components

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

[<i class="fa-brands fa-github"></i> Source code](https://github.com/vtex-apps/shipping-option-components)

> ⚠️ This app is no longer maintained by VTEX. This means support and maintenance are no longer provided. For more details, see the release note [Store Framework: Shipping Option Components deprecated in favor of Delivery Promise Components](https://developers.vtex.com/updates/release-notes/2026-04-20-store-framework-shipping-option-components-deprecated-in-favor-of-delivery-promise-components).

The Shipping Option Components app exports a component that allows you to filter store products by location or pickup point. Shoppers can share their location automatically (for example, through browser or device settings) or enter it manually.

Merchants can choose whether providing a location is optional or required. However, the shopper must provide their location for the Delivery Promise feature to work.

![shipping-option-components](https://vtexhelp.vtexassets.com/assets/docs/src/shipping-option-components___c5a1d86b0ebf692a3eb9ca49f79b55f8.png)

## Configuration

### Adding the Shipping Option Components app to your theme dependencies

Add the `shipping-option-components` app to your theme dependencies in the `manifest.json` as shown below:

```json
  "dependencies": {
    "vtex.shipping-option-components": "1.x"
  }
```

You can now use all blocks exported by the `shipping-option-components` app. See the full list below:

| Block name                          | Description                                                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
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
    "showLocationDetectorButton": true
  }
},
```

#### `shipping-option-location-selector` props

| Prop name                    | Type      | Description                                                                                                                                                                                                                                                                                                                                    | Default value         |
| ---------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `callToAction`               | `enum`    | Defines the type of overlay that opens when the page loads. Possible values: `modal` (modal that requires a postal code input), `popover-input` (popover for postal code input), `popover-button` (popover that opens with a button). | `popover-input`       |
| `compactMode`                | `boolean` | Determines whether the button displays its label. When true, the label is hidden, showing only its value.                                                                                                                                                                                                      | `false`               |
| `dismissible`                | `boolean` | Controls whether the modal can be dismissed without entering a postal code. When set to `false`, the modal can't be closed until a postal code is entered. Must be used along with `callToAction` to correctly set a blocking modal.                                                           | `true`                |
| `shippingSelection`          | `enum`    | Defines the type of shipping option selector to be displayed. Possible values: `delivery-and-pickup` (shows both options), `only-pickup` (shows only the pickup store selector)                                                                                          | `delivery-and-pickup` |
| `showLocationDetectorButton` | `boolean` | When set to `true`, displays a location detector button that automatically detects the user's current location using geolocation API and sets the postal code based on their coordinates. The button appears both in the main component and in the location modal.                                             | `false`               |

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
| `locationDetectorButton`          |
| `locationDetectorButtonContainer` |
| `locationDetectorButtonIcon`      |
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

Special thanks to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
