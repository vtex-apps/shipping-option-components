/* eslint-disable no-restricted-globals */
import { useCallback, useEffect, useState } from 'react'
import { useRuntime, useSSR } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import { getCountryCode, getFacetsData, getOrderFormId } from '../utils/cookie'
import messages from '../messages'
import {
  getAddress,
  getCartProducts,
  getPickups,
  updateOrderForm,
  updateSession,
} from '../client'
import { CartItem, CartProduct } from '../components/UnavailableItemsModal'

declare let window: any

const useShippingOptions = () => {
  const [inputZipCode, setInputZipCode] = useState<string>()
  const [selectedZipCode, setSelectedZipCode] = useState<string | null>()
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [countryCode, setCountryCode] = useState<string>()
  const [inputErrorMessage, setInputErrorMessage] = useState<string>()
  const [city, setCity] = useState<string>()
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [selectedPickup, setSelectecPickup] = useState<Pickup>()
  const [geoCoordinates, setGeoCoordinates] = useState<number[]>()
  const [shippingOption, setShippingOption] = useState<
    'delivery' | 'pickup-in-point'
  >()

  const [unavailableCartItems, setUnavailableCartItems] = useState<CartItem[]>(
    []
  )

  const isSSR = useSSR()
  const { account } = useRuntime()
  const intl = useIntl()
  const { push } = usePixel()

  const fetchPickups = useCallback(
    async (country: string, zipCode: string, coordinates: number[]) => {
      const responsePickups = await getPickups(country, zipCode, account)

      setPickups(responsePickups.items)

      if (responsePickups?.items?.length === 0) {
        setIsLoading(false)

        return
      }

      const pickupPointId = getFacetsData('pickupPoint')

      if (pickupPointId) {
        const pickup = responsePickups.items.find(
          (p: any) => p.pickupPoint.id === pickupPointId
        )

        setSelectecPickup(pickup)
        await updateSession(
          country,
          zipCode,
          coordinates,
          pickup,
          shippingOption
        )
      }

      setIsLoading(false)
    },
    [account, shippingOption]
  )

  useEffect(() => {
    if (isSSR) {
      return
    }

    const segmentZipCode = getFacetsData('zip-code')
    const segmentCountryCode = getCountryCode()
    const segmentShippingOption = getFacetsData('shipping')

    setSelectedZipCode(segmentZipCode ?? null)
    setInputZipCode(segmentZipCode)
    setCountryCode(segmentCountryCode)
    setShippingOption(segmentShippingOption as 'delivery' | 'pickup-in-point')

    if (segmentZipCode) {
      getAddress(segmentCountryCode, segmentZipCode, account).then((res) => {
        setCity(res.city)
        setGeoCoordinates(res.geoCoordinates)
        fetchPickups(segmentCountryCode, segmentZipCode, res.geoCoordinates)
      })
    } else {
      setIsLoading(false)
    }
  }, [account, isSSR, fetchPickups])

  const onError = (message: string) => {
    setInputErrorMessage(message)
    setIsLoading(false)

    setTimeout(() => {
      setInputErrorMessage(undefined)
    }, 3000)
  }

  const onSelectPickup = async (pickup: Pickup, shouldPersistFacet = true) => {
    setSelectecPickup(pickup)

    if (!countryCode || !selectedZipCode || !geoCoordinates) {
      return
    }

    await updateSession(
      countryCode,
      selectedZipCode,
      geoCoordinates,
      pickup,
      shouldPersistFacet ? 'pickup-in-point' : shippingOption
    )

    location.reload()
  }

  const handleIsLoading = () => {
    setIsLoading(true)
    setIsPageLoading(false)
  }

  const validateCartItems = async () => {
    const orderFormId = getOrderFormId()

    const products = await getCartProducts(orderFormId)

    // IMPORTANT: validate products here
    const unavailableItems = products.map(
      (product: CartProduct, id: number) => ({
        cartItemIndex: id,
        product,
      })
    )

    setUnavailableCartItems(unavailableItems)

    return unavailableItems
  }

  const onSubmit = async (reload = true) => {
    if (!countryCode) {
      return false
    }

    if (!inputZipCode) {
      onError(intl.formatMessage(messages.postalCodeInputPlaceHolder))

      return false
    }

    setPickups([])
    setCity(undefined)

    handleIsLoading()

    const orderFormId = getOrderFormId()

    if (orderFormId) {
      await updateOrderForm(countryCode, inputZipCode, orderFormId)
    }

    const { geoCoordinates: coordinates } = await getAddress(
      countryCode,
      inputZipCode,
      account
    )

    if (coordinates.length === 0) {
      onError(intl.formatMessage(messages.postalCodeInputError))

      return false
    }

    const unavailableItems = await validateCartItems()

    if (unavailableItems.length > 0) {
      setIsLoading(false)

      return false
    }

    setGeoCoordinates(coordinates)

    setSelectedZipCode(inputZipCode)

    await updateSession(countryCode, inputZipCode, coordinates)

    await fetchPickups(countryCode, inputZipCode, coordinates)

    if (!reload) {
      setIsLoading(false)
    }

    if (reload) {
      location.reload()
    }

    return true
  }

  const onChange = (zipCode?: string) => {
    setInputZipCode(zipCode)
  }

  const addressLabel = city ? `${selectedZipCode}, ${city}` : selectedZipCode

  useEffect(() => {
    window.addressLabel = addressLabel
    push({
      id: 'shipping-option-addressLabel',
      label: addressLabel,
    })
  }, [addressLabel, push])

  const pickupPointLabel = selectedPickup
    ? selectedPickup.pickupPoint.friendlyName
    : ''

  useEffect(() => {
    window.pickupPointLabel = pickupPointLabel
    push({
      id: 'shipping-option-pickupPointLabel',
      label: pickupPointLabel,
    })
  }, [pickupPointLabel, push])

  const isFirstLoading = isPageLoading && isLoading

  return {
    zipCode: inputZipCode,
    selectedZipCode,
    isLoading,
    isFirstLoading,
    inputErrorMessage,
    onSubmit,
    onChange,
    addressLabel,
    city,
    pickups,
    selectedPickup,
    onSelectPickup,
    geoCoordinates,
    shippingOption,
    countryCode,
    unavailableCartItems,
  }
}

export default useShippingOptions
