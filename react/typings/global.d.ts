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

declare type Mode = 'default' | 'icon'

interface StageContent {
  [key: string]: { title: string; content: React.JSX.Element }
}

declare global {
  interface Window {
    addressLabel?: stirng
    pickupPointLabel?: string
  }
}
