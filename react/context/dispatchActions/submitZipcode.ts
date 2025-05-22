/* eslint-disable no-restricted-globals */
import { IntlShape } from 'react-intl'

import messages from '../../messages'
import { getOrderFormId } from '../../utils/cookie'
import { getAddress, updateOrderForm, updateSession } from '../../client'
import { ShippingMethod } from '../ShippingOptionContext'
import { fetchPickups } from './fetchPickups'

type SubmitParams = {
  selectedZipcode: string
  onError: (message: string) => void
  onSuccess: (
    cityName: string,
    coordinates: [number, number],
    selectedZipcode: string,
    shippingOption?: string
  ) => void
  onLoading: (state: boolean) => void
  onPickupListFetch: (pickupList: any[]) => void
  onPickupSelect: (pickup: any) => void
  intl: IntlShape
  reload?: boolean
  account: string
  countryCode?: string
  shippingOption?: ShippingMethod
}

export const submitZipcode = async ({
  selectedZipcode,
  onError,
  intl,
  countryCode,
  onLoading,
  account,
  onSuccess,
  onPickupListFetch,
  onPickupSelect,
  reload = true,
}: SubmitParams) => {
  if (!selectedZipcode) {
    onError(intl.formatMessage(messages.postalCodeInputPlaceHolder))

    return
  }

  if (!countryCode) {
    return
  }

  onLoading(true)

  try {
    const { geoCoordinates: coordinates, city: cityName } = await getAddress(
      countryCode,
      selectedZipcode,
      account
    )

    if (coordinates.length === 0) {
      onError(intl.formatMessage(messages.postalCodeInputError))

      return
    }

    const orderFormId = getOrderFormId()

    if (orderFormId) {
      await updateOrderForm(countryCode, selectedZipcode, orderFormId)
    }

    onSuccess(cityName, coordinates, selectedZipcode)

    await updateSession(countryCode, selectedZipcode, coordinates)

    await fetchPickups({
      account,
      selectedZipcode,
      coordinates,
      country: countryCode,
      onFinish: () => onLoading(false),
      onPickupListFetch,
      onPickupSelect,
    })
  } catch {
    onError(intl.formatMessage(messages.postalCodeInputError))

    return
  }

  if (!reload) {
    onLoading(false)
  }

  if (reload) {
    location.reload()
  }
}
