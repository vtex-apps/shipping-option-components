/* eslint-disable no-restricted-globals */
import { useRuntime, useSSR } from 'vtex.render-runtime'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  getAddress,
  getPickups,
  updateOrderForm,
  updateSession,
} from '../client'
import { getCountryCode, getFacetsData, getOrderFormId } from '../utils/cookie'
import messages from '../messages'
import { ShippingMethod, ShippingOptionActions } from './ShippingOptionContext'

export const useShippingOption = () => {
  const [zipcode, setZipCode] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [countryCode, setCountryCode] = useState<string>()
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()
  const [city, setCity] = useState<string>()
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [selectedPickup, setSelectecPickup] = useState<Pickup>()
  const [geoCoordinates, setGeoCoordinates] = useState<number[]>()
  const [addressLabel, setAddressLabel] = useState<string>()
  const [shippingOption, setShippingOption] = useState<ShippingMethod>()

  const { account } = useRuntime()
  const isSSR = useSSR()
  const intl = useIntl()

  const fetchPickups = useCallback(
    async (
      country: string,
      selectedZipcode: string,
      coordinates: number[],
      shippingMethod?: ShippingMethod
    ) => {
      const responsePickups = await getPickups(
        country,
        selectedZipcode,
        account
      )

      setPickups(responsePickups?.items ?? [])

      if (responsePickups?.items.length === 0) {
        setIsLoading(false)

        return
      }

      const pickupPointId = getFacetsData('pickupPoint')

      if (pickupPointId) {
        const pickup = responsePickups.items.find(
          (p: Pickup) => p.pickupPoint.id === pickupPointId
        )

        setSelectecPickup(pickup)

        await updateSession(
          country,
          selectedZipcode,
          coordinates,
          pickup,
          shippingMethod
        )
      }

      setIsLoading(false)
    },
    [account]
  )

  useEffect(() => {
    if (isSSR) {
      return
    }

    const segmentZipCode = getFacetsData('zip-code')
    const segmentCountryCode = getCountryCode()
    const segmentShippingOption = getFacetsData('shipping') as ShippingMethod

    setZipCode(segmentZipCode)
    setShippingOption(segmentShippingOption)
    setCountryCode(segmentCountryCode)

    if (segmentZipCode) {
      try {
        getAddress(segmentCountryCode, segmentZipCode, account).then((res) => {
          setCity(res.city)
          setGeoCoordinates(res.geoCoordinates)
          fetchPickups(
            segmentCountryCode,
            segmentZipCode,
            res.geoCoordinates,
            segmentShippingOption
          )
        })
      } catch {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [account, isSSR, fetchPickups])

  const onError = (message: string) => {
    setSubmitErrorMessage(message)
    setIsLoading(false)

    setTimeout(() => {
      setSubmitErrorMessage(undefined)
    }, 3000)
  }

  const submitZipcode = async (selectedZipcode: string, reload = true) => {
    if (!selectedZipcode) {
      onError(intl.formatMessage(messages.postalCodeInputPlaceHolder))

      return
    }

    if (!countryCode) {
      return
    }

    setIsLoading(true)

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

      setCity(cityName)
      setGeoCoordinates(coordinates)
      setZipCode(selectedZipcode)

      await updateSession(countryCode, selectedZipcode, coordinates)

      await fetchPickups(
        countryCode,
        selectedZipcode,
        coordinates,
        shippingOption
      )
    } catch {
      onError(intl.formatMessage(messages.postalCodeInputError))

      return
    }

    if (!reload) {
      setIsLoading(false)
    }

    if (reload) {
      location.reload()
    }
  }

  const selectPickup = async (pickup: Pickup, shouldPersistFacet = true) => {
    if (!countryCode || !zipcode || !geoCoordinates) {
      return
    }

    setSelectecPickup(pickup)

    await updateSession(
      countryCode,
      zipcode!,
      geoCoordinates!,
      pickup,
      shouldPersistFacet ? 'pickup-in-point' : shippingOption
    )

    location.reload()
  }

  const selectDeliveryShippingOption = async () => {
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

  useEffect(() => {
    setAddressLabel(city ? `${city}, ${zipcode}` : zipcode)
  }, [zipcode, city])

  const dispatch = (action: ShippingOptionActions) => {
    switch (action.type) {
      case 'UPDATE_ZIPCODE': {
        const { zipcode: zipcodeSelected, reload } = action.args

        submitZipcode(zipcodeSelected, reload)
        break
      }

      case 'UPDATE_PICKUP': {
        const { pickup, shouldPersistFacet } = action.args

        selectPickup(pickup, shouldPersistFacet)
        break
      }

      case 'SELECT_DELIVERY_SHIPPING_OPTION': {
        selectDeliveryShippingOption()
        break
      }

      default:
        break
    }
  }

  return {
    dispatch,
    state: {
      zipcode,
      isLoading,
      countryCode,
      submitErrorMessage,
      city,
      pickups,
      selectedPickup,
      geoCoordinates,
      addressLabel,
      shippingOption,
    },
  }
}
