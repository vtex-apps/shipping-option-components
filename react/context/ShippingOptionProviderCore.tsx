import React, { ReactNode } from 'react'

import {
  ShippingOptionDispatchContext,
  ShippingOptionStateContext,
} from './ShippingOptionContext'
import { useShippingOption } from './useShippingOption'

interface Props {
  children?: ReactNode
}

export const ShippingOptionProviderCore = ({ children }: Props) => {
  const { dispatch, state } = useShippingOption()

  return (
    <ShippingOptionStateContext.Provider value={state}>
      <ShippingOptionDispatchContext.Provider value={dispatch}>
        {children}
      </ShippingOptionDispatchContext.Provider>
    </ShippingOptionStateContext.Provider>
  )
}
