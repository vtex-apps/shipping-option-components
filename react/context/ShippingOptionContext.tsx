import React, { createContext, ReactNode, useContext } from 'react'

import { useShippingOption } from './useShippingOption'

export type ShippingMethod = 'delivery' | 'pickup-in-point'

export interface State {
  zipcode?: string
  pickups: Pickup[]
  selectedPickup?: Pickup
  geoCoordinates?: number[]
  countryCode?: string
  city?: string
  isLoading: boolean
  shippingOption?: ShippingMethod
  addressLabel?: string
  submitErrorMessage?: string
}

interface UpdateZipCode {
  type: 'UPDATE_ZIPCODE'
  args: { zipcode: string; reload?: boolean }
}

interface UpdatePickup {
  type: 'UPDATE_PICKUP'
  args: { pickup: Pickup; shouldPersistFacet?: boolean }
}

interface SelectDeliveryShippingOption {
  type: 'SELECT_DELIVERY_SHIPPING_OPTION'
}

export type ShippingOptionActions =
  | UpdateZipCode
  | UpdatePickup
  | SelectDeliveryShippingOption

const DEFAULT_STATE: State = {
  pickups: [],
  isLoading: true,
}

const ShippingOptionStateContext = createContext<State>(DEFAULT_STATE)
const ShippingOptionDispatchContext = createContext(
  (_: ShippingOptionActions) => {}
)

interface Props {
  children?: ReactNode
}

const ShippingOptionProvider = ({ children }: Props) => {
  const { dispatch, state } = useShippingOption()

  return (
    <ShippingOptionStateContext.Provider value={state}>
      <ShippingOptionDispatchContext.Provider value={dispatch}>
        {children}
      </ShippingOptionDispatchContext.Provider>
    </ShippingOptionStateContext.Provider>
  )
}

const useShippingOptionState = () => useContext(ShippingOptionStateContext)

const useShippingOptionDispatch = () =>
  useContext(ShippingOptionDispatchContext)

export {
  ShippingOptionProvider,
  useShippingOptionState,
  useShippingOptionDispatch,
}
