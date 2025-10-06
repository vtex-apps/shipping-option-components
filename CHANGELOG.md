# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.1] - 2025-10-06

### Changed

- Added a callout about Delivery Promises in README.md.

## [1.7.0] - 2025-10-02

### Fixed

- Send zipCode as a string in update orderForm request

## [1.6.2] - 2025-09-23

### Removed

- `vtex.react-portal` and `vtex.store-drawer` dependencies

### Changed

- React to @16
- ReactModal compatibility with React 16

### Added

- Docs file for availabilityBadges
- Tests file for availability Badges

## [1.6.1] - 2025-08-04

### Changed

- Updated the app version mentioned in README.md.

## [1.6.0] - 2025-07-16

### Added

- Cart products validation.

## [1.5.0] - 2025-07-14

### Added

- `AvailabilityBadges` component to use in `ProductSummary`.

## [1.4.0] - 2025-07-14

### Added

- Validation to verify that the postal code has products available.

## [1.3.0] - 2025-06-10

### Added

- Context to share states with other apps
- Export `PickupModal` and `LocationModal`

## [1.2.0] - 2025-06-06

### Added

- Popover adjusted to positioning on the page.

## [1.1.1] - 2025-05-26

### Added

- Props documentation

## [1.1.0] - 2025-05-16

### Added

- Icon mode

## [1.0.1] - 2025-04-22

### Fixed

- Dismissible behavior on shipping vs pickup modal
- Spanish description on shipping vs pickup modal
- Situation where user get stuck after providing a invalid zipcode.

## [1.0.0] - 2025-03-31

### Added

- Major layout adjustments
- Shipping modal

## [0.6.1] - 2025-03-13

### Fixed

- Bad formatting of shipping info cookie

## [0.6.0] - 2025-03-07

### Added

- country inside the body facets

## [0.5.5] - 2025-02-26

### Removed

- Remove DP variant validation.

## [0.5.4] - 2025-01-29

### Fixed

- Missing translations update

## [0.5.3] - 2025-01-17

### Fixed

- The selected pickup point does not change due to a problem updating cookie data

## [0.5.2] - 2025-01-17

### Fixed

- The hideStoreSelection property removes the Pickup Drawer and it cannot be opened

## [0.5.1] - 2024-12-19

### Fixed

- sometimes zip code is not updated due to a problem in `__RUNTIME__.segmentToken`

## [0.5.0] - 2024-12-18

### Added

- Popover to open the location drawer;
- Popover with input to add postal code.

## [0.4.2] - 2024-11-06

### Fixed

- Selected pickup doesn't work on first load

## [0.4.1] - 2024-11-01

### Fixed

- Drawer opens behind the sidebar

## [0.4.0] - 2024-10-04

### Fixed

- Selected pickup did not change.

## [0.3.0] - 2024-10-04

### Added

- Catalan, Czech, Danish, Greek, Finnish, Hungarian, Indonesian, Norwegian, Polish, Russian, Slovak, Slovenian, Swedish and Ukrainian translations.

## [0.2.0] - 2024-10-02

### Added

- orderForm integration from PLP to cart

## [0.1.2] - 2024-09-12

## [0.1.1] - 2024-09-12

## [0.1.0] - 2024-09-12

### Fixed

- English, Portuguese and Spanish translations.
- Crowdin integration file.

### Added

- Bulgharian, German, French, Italian, Japanese, Korean, Dutch, Romanian and Thai translations

### Added

- Initial release.
