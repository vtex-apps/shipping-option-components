/* eslint-disable no-restricted-globals */
import { useRuntime, useSSR } from 'vtex.render-runtime'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { usePixelEventCallback } from 'vtex.pixel-manager'

import {
  getAddress,
  getPickups,
  updateOrderForm,
  updateSession,
  getCartProducts,
  removeCartProductsById,
  validateProductAvailability,
  validateProductAvailabilityByPickup,
  validateProductAvailabilityByDelivery,
} from '../client'
import { CartItem, CartProduct } from '../components/UnavailableItemsModal'
import { getCountryCode, getFacetsData, getOrderFormId } from '../utils/cookie'
import messages from '../messages'
import { ShippingMethod, ShippingOptionActions } from './ShippingOptionContext'
import { SHIPPING_MODAL_PIXEL_EVENT_ID } from '../constants'

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
  const [unavailableCartItems, setUnavailableCartItems] = useState<CartItem[]>(
    []
  )

  const [pendingAddToCartItem, setPendingAddToCartItem] = useState<any>()

  const [unavailabilityMessage, setUnavailabilityMessage] = useState<string>()

  const [
    actionInterruptedByCartValidation,
    setActionInterruptedByCartValidation,
  ] = useState<() => void>()

  const { account } = useRuntime()
  const isSSR = useSSR()
  const intl = useIntl()
  const { addItems } = useOrderItems()

  usePixelEventCallback({
    eventId: SHIPPING_MODAL_PIXEL_EVENT_ID,
    handler: (event: any) => {
      setPendingAddToCartItem(event.data.addToCartInfo)
    },
  })

  const fetchPickups = useCallback(
    async (
      country: string,
      selectedZipcode: string,
      coordinates: number[],
      shippingMethod?: ShippingMethod,
      keepLoading = false
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

      if (!keepLoading) {
        setIsLoading(false)
      }
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

  const validateCartItems = async (
    validationHandler: (products: string[]) => Promise<any>
  ) => {
    setIsLoading(true)

    try {
      const orderFormId = getOrderFormId()

      const products = await getCartProducts(orderFormId)

      const productIds = products.map((product: CartProduct) => product.id)

      const { unavailableProducts } = await validationHandler(productIds)

      const unavailableItems = products
        .map((product: CartProduct, id: number) => ({
          cartItemIndex: id,
          product,
        }))
        .filter((item: any) =>
          unavailableProducts.some((id: string) => id === item.product.id)
        )

      setUnavailableCartItems(unavailableItems)

      setIsLoading(false)

      return unavailableItems
    } catch {
      setIsLoading(false)
      setUnavailableCartItems([])

      return []
    }
  }

  const resetUnavailableCartItems = async () => {
    setUnavailableCartItems([])
  }

  const removeUnavailableItems = async () => {
    const orderFormId = getOrderFormId()

    await removeCartProductsById(
      orderFormId,
      unavailableCartItems.map((item) => item.cartItemIndex)
    )

    if (actionInterruptedByCartValidation) {
      actionInterruptedByCartValidation()
    }
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
        shippingOption,
        true
      )
    } catch {
      onError(intl.formatMessage(messages.postalCodeInputError))

      return
    }

    setShippingOption(undefined)
    setSelectecPickup(undefined)

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

  const dispatch = async (action: ShippingOptionActions) => {
    switch (action.type) {
      case 'UPDATE_ZIPCODE': {
        const { zipcode: zipcodeSelected, reload } = action.args

        const unavailableItems = await validateCartItems(
          async (products: string[]) =>
            validateProductAvailability(
              zipcodeSelected,
              countryCode!,
              products,
              account
            )
        )

        if (unavailableItems.length === 0) {
          submitZipcode(zipcodeSelected, reload)
          break
        }

        setUnavailabilityMessage(
          intl.formatMessage(messages.unavailableItemsModalDescription, {
            addressLabel,
          })
        )

        setActionInterruptedByCartValidation(() => () =>
          submitZipcode(zipcodeSelected, reload)
        )

        break
      }

      case 'UPDATE_PICKUP': {
        const { pickup, shouldPersistFacet } = action.args

        setUnavailabilityMessage('pickup')

        const unavailableItems = await validateCartItems(
          async (products: string[]) =>
            validateProductAvailabilityByPickup(pickup.pickupPoint.id, products)
        )

        if (unavailableItems.length === 0) {
          selectPickup(pickup, shouldPersistFacet)

          if (pendingAddToCartItem) {
            await addItems(
              pendingAddToCartItem.skuItems,
              pendingAddToCartItem.options
            )

            setPendingAddToCartItem(undefined)
          }

          break
        }

        setUnavailabilityMessage(
          intl.formatMessage(
            messages.unavailableItemsModalForPickupDescription,
            {
              pickupLabel: selectedPickup?.pickupPoint.friendlyName,
            }
          )
        )

        setActionInterruptedByCartValidation(() => () =>
          selectPickup(pickup, shouldPersistFacet)
        )

        break
      }

      case 'SELECT_DELIVERY_SHIPPING_OPTION': {
        setUnavailabilityMessage('delivery')

        const unavailableItems = await validateCartItems(
          async (products: string[]) =>
            validateProductAvailabilityByDelivery(
              zipcode!,
              countryCode!,
              products,
              account
            )
        )

        if (unavailableItems.length === 0) {
          selectDeliveryShippingOption()

          if (pendingAddToCartItem) {
            await addItems(
              pendingAddToCartItem.skuItems,
              pendingAddToCartItem.options
            )

            setPendingAddToCartItem(undefined)
          }

          break
        }

        setUnavailabilityMessage(
          intl.formatMessage(
            messages.unavailableItemsModalForDeliveryDescription,
            {
              addressLabel,
            }
          )
        )

        setActionInterruptedByCartValidation(() => () =>
          selectDeliveryShippingOption()
        )

        break
      }

      case 'ABORT_UNAVAILABLE_ITEMS_ACTION': {
        resetUnavailableCartItems()
        break
      }

      case 'CONTINUE_UNAVAILABLE_ITEMS_ACTION': {
        removeUnavailableItems()
        break
      }

      default:
        break
    }
  }

  const areThereUnavailableCartItems = unavailableCartItems.length > 0

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
      areThereUnavailableCartItems,
      unavailableCartItems,
      unavailabilityMessage,
    },
  }
}
