import React from 'react'
import { screen, render } from '@vtex/test-tools/react'

import * as useShippingOption from '../context/useShippingOption'
import * as ShippingOptionProviderCore from '../context/ShippingOptionProviderCore'
import { ShippingOptionProvider } from '../context/ShippingOptionContext'

jest.mock('vtex.order-items')
jest.mock('vtex.pixel-manager')

// Note: console.errors are expected in these tests because we are testing error boundaries
// React always logs errors to console even when they are caught by error boundaries
describe('ShippingOptionContext should render its children even when', () => {
  it('useShippingOption throws an error', () => {
    const mock = jest
      .spyOn(useShippingOption, 'useShippingOption')
      .mockImplementation(() => {
        throw new Error('Test error in useShippingOption')
      })

    render(
      <ShippingOptionProvider>
        <span>Children message</span>
      </ShippingOptionProvider>
    )

    mock.mockRestore()

    expect(screen.queryByText('Children message')).toBeInTheDocument()
  })

  it('ShippingOptionContextCore throws an error', () => {
    const mock = jest
      .spyOn(ShippingOptionProviderCore, 'ShippingOptionProviderCore')
      .mockImplementation(() => {
        throw new Error('Test error in ShippingOptionProviderCore')
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
