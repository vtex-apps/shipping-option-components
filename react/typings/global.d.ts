declare interface Pickup {
  distance: number
  pickupPoint: {
    id: string
    friendlyName: string
    address: {
      neighborhood: string
      street: string
      postalCode: string
      city: string
      number: string
      state: string
    }
    isActive: boolean
  }
}

declare type CallToAction = 'popover-button' | 'popover-input' | 'modal'

declare type ShippingSelection = 'only-pickup' | 'delivery-and-pickup'

interface StageContent {
  [key: string]: { title: string; content: React.JSX.Element }
}

declare global {
  interface Window {
    addressLabel?: stirng
    pickupPointLabel?: string
  }
}

type ShippingMethod = 'delivery' | 'pickup-in-point'

interface UpdateZipCode {
  type: 'UPDATE_ZIPCODE'
  args: { zipcode: string; reload?: boolean }
}

interface UpdatePickup {
  type: 'UPDATE_PICKUP'
  args: { pickup: Pickup; shouldPersistFacet?: boolean }
}

interface SelectDeliveryShippingOption {
  type: 'SELECT_DELIVERY_SHIPPING_OPTION'
}

type ShippingOptionActions =
  | UpdateZipCode
  | UpdatePickup
  | SelectDeliveryShippingOption

interface SetZipCode {
  type: 'SET_ZIPCODE'
  args: { zipcode?: string }
}

interface SetPickup {
  type: 'SET_PICKUP'
  args: { pickup: Pickup }
}

interface SetGeoCoordinates {
  type: 'SET_GEO_COORDINATES'
  args: { geoCoordinates?: number[] }
}

interface SetIsLoading {
  type: 'SET_IS_LOADING'
  args: { isLoading: boolean }
}

interface SetPickups {
  type: 'SET_PICKUPS'
  args: { pickups: Pickup[] }
}

interface SetCountryCode {
  type: 'SET_COUNTRY_CODE'
  args: { countryCode?: string }
}

interface SetCity {
  type: 'SET_CITY'
  args: { city?: string }
}

interface SetShippingOption {
  type: 'SET_SHIPPING_OPTION'
  args: { shippingOption?: ShippingMethod }
}

interface SetAddressLabel {
  type: 'SET_ADDRESS_LABEL'
  args: { addressLabel?: string }
}

interface SetSubmitErrorMessage {
  type: 'SET_SUBMIT_ERROR_MESSAGE'
  args: { submitErrorMessage?: string }
}

type ContextActions =
  | SetZipCode
  | SetPickup
  | SetGeoCoordinates
  | SetIsLoading
  | SetPickups
  | SetCountryCode
  | SetCity
  | SetShippingOption
  | SetAddressLabel
  | SetSubmitErrorMessage
