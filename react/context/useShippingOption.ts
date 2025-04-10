/* eslint-disable no-restricted-globals */
import { useRuntime, useSSR } from 'vtex.render-runtime'
import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { State } from './ShippingOptionContext'
import {
  getAddress,
  getPickups,
  updateOrderForm,
  updateSession,
} from '../client'
import { getCountryCode, getFacetsData, getOrderFormId } from '../utils/cookie'
import messages from '../messages'

export const useShippingOption = (
  state: State,
  dispatch: React.Dispatch<ContextActions>
) => {
  const { account } = useRuntime()
  const isSSR = useSSR()
  const intl = useIntl()
  const {
    zipcode,
    geoCoordinates,
    countryCode,
    shippingOption,
    selectedPickup,
    city,
  } = state

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

      dispatch({
        type: 'SET_PICKUPS',
        args: { pickups: responsePickups?.items ?? [] },
      })

      if (responsePickups?.items.length === 0) {
        dispatch({ type: 'SET_IS_LOADING', args: { isLoading: false } })

        return
      }

      const pickupPointId = getFacetsData('pickupPoint')

      if (pickupPointId) {
        const pickup = responsePickups.items.find(
          (p: Pickup) => p.pickupPoint.id === pickupPointId
        )

        dispatch({
          type: 'SET_PICKUP',
          args: { pickup },
        })

        await updateSession(
          country,
          selectedZipcode,
          coordinates,
          pickup,
          shippingMethod
        )
      }

      dispatch({ type: 'SET_IS_LOADING', args: { isLoading: false } })
    },
    [account, dispatch]
  )

  useEffect(() => {
    if (isSSR) {
      return
    }

    const segmentZipCode = getFacetsData('zip-code')
    const segmentCountryCode = getCountryCode()
    const segmentShippingOption = getFacetsData('shipping') as ShippingMethod

    dispatch({
      type: 'SET_ZIPCODE',
      args: { zipcode: segmentZipCode },
    })

    dispatch({
      type: 'SET_SHIPPING_OPTION',
      args: { shippingOption: segmentShippingOption },
    })

    dispatch({
      type: 'SET_COUNTRY_CODE',
      args: { countryCode: segmentCountryCode },
    })

    if (segmentZipCode) {
      getAddress(segmentCountryCode, segmentZipCode, account).then((res) => {
        dispatch({
          type: 'SET_CITY',
          args: { city: res.city },
        })
        dispatch({
          type: 'SET_GEO_COORDINATES',
          args: { geoCoordinates: res.geoCoordinates },
        })
        fetchPickups(
          segmentCountryCode,
          segmentZipCode,
          res.geoCoordinates,
          segmentShippingOption
        )
      })
    } else {
      dispatch({ type: 'SET_IS_LOADING', args: { isLoading: false } })
    }
  }, [account, isSSR, fetchPickups, dispatch])

  const onError = (message: string) => {
    dispatch({
      type: 'SET_SUBMIT_ERROR_MESSAGE',
      args: { submitErrorMessage: message },
    })
    dispatch({ type: 'SET_IS_LOADING', args: { isLoading: false } })

    setTimeout(() => {
      dispatch({
        type: 'SET_SUBMIT_ERROR_MESSAGE',
        args: { submitErrorMessage: undefined },
      })
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

    dispatch({ type: 'SET_IS_LOADING', args: { isLoading: true } })

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

    dispatch({ type: 'SET_CITY', args: { city: cityName } })

    dispatch({
      type: 'SET_GEO_COORDINATES',
      args: { geoCoordinates: coordinates },
    })

    dispatch({
      type: 'SET_ZIPCODE',
      args: { zipcode: selectedZipcode },
    })

    await updateSession(countryCode, selectedZipcode, coordinates)

    await fetchPickups(
      countryCode,
      selectedZipcode,
      coordinates,
      shippingOption
    )

    if (!reload) {
      dispatch({ type: 'SET_IS_LOADING', args: { isLoading: false } })
    }

    if (reload) {
      location.reload()
    }
  }

  const selectPickup = async (pickup: Pickup, shouldPersistFacet = true) => {
    if (!countryCode || !zipcode || !geoCoordinates) {
      return
    }

    dispatch({
      type: 'SET_PICKUP',
      args: { pickup },
    })

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
    dispatch({
      type: 'SET_ADDRESS_LABEL',
      args: {
        addressLabel: city ? `${city}, ${zipcode}` : zipcode,
      },
    })
  }, [dispatch, zipcode, city])

  return async (action: ShippingOptionActions) => {
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
}
