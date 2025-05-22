import { getPickups, updateSession } from '../../client'
import { getFacetsData } from '../../utils/cookie'
import { ShippingMethod } from '../ShippingOptionContext'

type FetchPickupParams = {
  country: string
  selectedZipcode: string
  coordinates: number[]
  account: string
  onPickupListFetch: (pickups: any[]) => void
  onFinish: () => void
  shippingMethod?: ShippingMethod
  onPickupSelect: (pickup: any) => void
}

export const fetchPickups = async ({
  country,
  selectedZipcode,
  coordinates,
  account,
  shippingMethod,
  onPickupListFetch,
  onFinish,
  onPickupSelect,
}: FetchPickupParams) => {
  const responsePickups = await getPickups(country, selectedZipcode, account)

  onPickupListFetch(responsePickups?.items ?? [])

  if (responsePickups?.items.length === 0) {
    onFinish()

    return
  }

  const pickupPointId = getFacetsData('pickupPoint')

  if (pickupPointId) {
    const pickup = responsePickups.items.find(
      (p: Pickup) => p.pickupPoint.id === pickupPointId
    )

    onPickupSelect(pickup)

    await updateSession(
      country,
      selectedZipcode,
      coordinates,
      pickup,
      shippingMethod
    )
  }

  onFinish()
}
