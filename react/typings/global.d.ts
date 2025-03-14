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

declare type OverlayType = 'popover-button' | 'popover-input' | 'blocking-modal'

interface StageContent {
  [key: string]: { title: string; content: React.JSX.Element }
}

declare global {
  interface Window {
    addressLabel?: stirng
    pickupPointLabel?: string
  }
}
