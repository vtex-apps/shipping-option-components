/* eslint-disable no-restricted-globals */
import { updateSession } from '../../client'

type SelectDeliveryShippingOptionParams = {
  countryCode?: string
  zipcode?: string
  geoCoordinates?: number[]
  selectedPickup?: Pickup
}

export const selectDeliveryShippingOption = async ({
  countryCode,
  geoCoordinates,
  selectedPickup,
  zipcode,
}: SelectDeliveryShippingOptionParams) => {
  if (!countryCode || !zipcode || !geoCoordinates) {
    return
  }

  await updateSession(
    countryCode,
    zipcode,
    geoCoordinates,
    selectedPickup,
    'delivery'
  )

  location.reload()
}
