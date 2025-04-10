import React, { createContext, ReactNode, useContext, useReducer } from 'react'

import { useShippingOption } from './useShippingOption'

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

const DEFAULT_STATE: State = {
  pickups: [],
  isLoading: true,
}

const ShippingOptionStateContext = createContext<State>(DEFAULT_STATE)
const ShippingOptionDispatchContext = createContext(
  (_: ShippingOptionActions) => {}
)

function reducer(state: State, action: ContextActions): State {
  switch (action.type) {
    case 'SET_ZIPCODE': {
      const { zipcode } = action.args

      return { ...state, zipcode }
    }

    case 'SET_PICKUP': {
      const { pickup } = action.args

      return { ...state, selectedPickup: pickup }
    }

    case 'SET_GEO_COORDINATES': {
      const { geoCoordinates } = action.args

      return { ...state, geoCoordinates }
    }

    case 'SET_IS_LOADING': {
      const { isLoading } = action.args

      return { ...state, isLoading }
    }

    case 'SET_PICKUPS': {
      const { pickups } = action.args

      return { ...state, pickups }
    }

    case 'SET_COUNTRY_CODE': {
      const { countryCode } = action.args

      return { ...state, countryCode }
    }

    case 'SET_CITY': {
      const { city } = action.args

      return { ...state, city }
    }

    case 'SET_SHIPPING_OPTION': {
      const { shippingOption } = action.args

      return { ...state, shippingOption }
    }

    case 'SET_ADDRESS_LABEL': {
      const { addressLabel } = action.args

      return { ...state, addressLabel }
    }

    case 'SET_SUBMIT_ERROR_MESSAGE': {
      const { submitErrorMessage } = action.args

      return { ...state, submitErrorMessage }
    }

    default:
      return state
  }
}

interface Props {
  children?: ReactNode
}

const ShippingOptionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const ShippingOptionDispatch = useShippingOption(state, dispatch)

  return (
    <ShippingOptionStateContext.Provider value={state}>
      <ShippingOptionDispatchContext.Provider value={ShippingOptionDispatch}>
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
