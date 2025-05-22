/* eslint-disable no-restricted-globals */
import { updateSession } from '../../client'

type SelectPickupParams = {
  countryCode?: string
  zipcode?: string
  geoCoordinates?: number[]
  pickup: Pickup
  shouldPersistFacet?: boolean
  onSelectPickup: (pickup: Pickup) => void
  shippingOption?: string
}

export const selectPickup = async ({
  pickup,
  shouldPersistFacet,
  countryCode,
  zipcode,
  geoCoordinates,
  onSelectPickup,
  shippingOption,
}: SelectPickupParams) => {
  if (!countryCode || !zipcode || !geoCoordinates) {
    return
  }

  onSelectPickup(pickup)

  await updateSession(
    countryCode,
    zipcode!,
    geoCoordinates!,
    pickup,
    shouldPersistFacet ? 'pickup-in-point' : shippingOption
  )

  location.reload()
}
