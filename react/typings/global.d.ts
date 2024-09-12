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
  }
}

declare global {
  interface Window {
    addressLabel?: stirng
    pickupPointLabel?: string
  }
}
