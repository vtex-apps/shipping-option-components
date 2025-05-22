import React from 'react'
import { screen, render } from '@vtex/test-tools/react'

import * as useShippingOption from '../context/useShippingOption'
import * as ShippingOptionProviderCore from '../context/ShippingOptionProviderCore'
import { ShippingOptionProvider } from '../context/ShippingOptionContext'

describe('ShippingOptionContext should render its children even when', () => {
  it('useShippingOption throws an error', () => {
    const mock = jest
      .spyOn(useShippingOption, 'useShippingOption')
      .mockImplementation(() => {
        throw new Error(
          'This error is intentional! We cant hide this console.error due to the https://github.com/facebook/react/issues/15069 issue'
        )
      })

    render(
      <ShippingOptionProvider>
        <span>Children message</span>
      </ShippingOptionProvider>
    )

    mock.mockRestore()

    expect(screen.queryByText('Children message')).toBeInTheDocument()
  })

  it('ShipingOptionContextCore throws an error', () => {
    const mock = jest
      .spyOn(ShippingOptionProviderCore, 'ShippingOptionProviderCore')
      .mockImplementation(() => {
        throw new Error(
          'This error is intentional! We cant hide this console.error due to the https://github.com/facebook/react/issues/15069 issue'
        )
      })

    render(
      <ShippingOptionProvider>
        <span>Children message</span>
      </ShippingOptionProvider>
    )

    mock.mockRestore()

    expect(screen.queryByText('Children message')).toBeInTheDocument()
  })
})
