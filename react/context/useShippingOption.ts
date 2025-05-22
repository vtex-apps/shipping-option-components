/* eslint-disable no-restricted-globals */
import { useRuntime, useSSR } from 'vtex.render-runtime'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { getAddress } from '../client'
import { getCountryCode, getFacetsData } from '../utils/cookie'
import { ShippingMethod, ShippingOptionActions } from './ShippingOptionContext'
import { submitZipcode } from './dispatchActions/submitZipcode'
import { selectPickup } from './dispatchActions/selectPickup'
import { fetchPickups } from './dispatchActions/fetchPickups'
import { selectDeliveryShippingOption } from './dispatchActions/selectDeliveryShippingOption'

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
          fetchPickups({
            account,
            coordinates: res.geoCoordinates,
            country: segmentCountryCode,
            onFinish: () => setIsLoading(false),
            onPickupListFetch: setPickups,
            onPickupSelect: setSelectecPickup,
            selectedZipcode: segmentZipCode,
            shippingMethod: segmentShippingOption,
          })
        })
      } catch {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [account, isSSR])

  const onError = (message: string) => {
    setSubmitErrorMessage(message)
    setIsLoading(false)

    setTimeout(() => {
      setSubmitErrorMessage(undefined)
    }, 3000)
  }

  useEffect(() => {
    setAddressLabel(city ? `${city}, ${zipcode}` : zipcode)
  }, [zipcode, city])

  const dispatch = (action: ShippingOptionActions) => {
    switch (action.type) {
      case 'UPDATE_ZIPCODE': {
        const { zipcode: selectedZipcode, reload } = action.args

        submitZipcode({
          account,
          intl,
          onError,
          onLoading: setIsLoading,
          onSuccess: (cityName, coordinates, zipCode) => {
            setCity(cityName)
            setGeoCoordinates(coordinates)
            setZipCode(zipCode)
          },
          onPickupListFetch: setPickups,
          onPickupSelect: setSelectecPickup,
          reload,
          selectedZipcode,
          countryCode,
          shippingOption,
        })
        break
      }

      case 'UPDATE_PICKUP': {
        const { pickup, shouldPersistFacet } = action.args

        selectPickup({
          onSelectPickup: setSelectecPickup,
          pickup,
          shouldPersistFacet,
          countryCode,
          geoCoordinates,
          shippingOption,
          zipcode,
        })
        break
      }

      case 'SELECT_DELIVERY_SHIPPING_OPTION': {
        selectDeliveryShippingOption({
          countryCode,
          geoCoordinates,
          selectedPickup,
          zipcode,
        })
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
