import React from 'react'
import { render, fireEvent, waitFor } from '@vtex/test-tools/react'
import * as reactIntl from 'react-intl'

import { useShippingOption } from '../context/useShippingOption'

// Mocks for external modules used by the hook
jest.mock('vtex.order-items/OrderItems', () => ({
  useOrderItems: () => ({ addItems: jest.fn() }),
}))

jest.mock('vtex.pixel-manager', () => ({
  usePixelEventCallback: () => {},
}))

jest.mock('vtex.render-runtime', () => ({
  useRuntime: () => ({ account: 'store' }),
  useSSR: () => false,
}))

jest.mock('../utils/cookie', () => ({
  getCountryCode: () => 'BR',
  getFacetsData: () => undefined,
  getOrderFormId: () => undefined,
}))

jest.mock('../client', () => ({
  getAddress: jest
    .fn()
    .mockResolvedValue({ geoCoordinates: [0, 0], city: 'City' }),
  getCatalogCount: jest.fn().mockResolvedValue({ total: 1 }),
  getPickups: jest.fn(() =>
    Promise.resolve({ items: [{ pickupPoint: { isActive: true, id: 'p1' } }] })
  ),
  updateOrderForm: jest.fn().mockResolvedValue(undefined),
  updateSession: jest.fn().mockResolvedValue(undefined),
  getCartProducts: jest.fn().mockResolvedValue([]),
  removeCartProductsById: jest.fn().mockResolvedValue(undefined),
  validateProductAvailability: jest
    .fn()
    .mockResolvedValue({ unavailableProducts: [] }),
  validateProductAvailabilityByPickup: jest
    .fn()
    .mockResolvedValue({ unavailableProducts: [] }),
  validateProductAvailabilityByDelivery: jest
    .fn()
    .mockResolvedValue({ unavailableProducts: [] }),
}))

const mockIntl = {
  formatMessage: ({ id }: { id: string }) => String(id),
} as unknown as reactIntl.IntlShape

jest.spyOn(reactIntl, 'useIntl').mockImplementation(() => mockIntl)

function TestComponent() {
  const { dispatch } = useShippingOption()

  return (
    <button
      data-testid="update"
      onClick={() =>
        dispatch({
          type: 'UPDATE_ZIPCODE',
          args: { zipcode: '12345-678', reload: true },
        })
      }
    >
      Update
    </button>
  )
}

describe('useShippingOption zipcode update', () => {
  let originalLocation: Location

  beforeEach(() => {
    jest.clearAllMocks()
    originalLocation = window.location
    const reloadMock = jest.fn()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: reloadMock },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('reloads the page after UPDATE_ZIPCODE with reload=true', async () => {
    const { getByTestId } = render(<TestComponent />)

    fireEvent.click(getByTestId('update'))

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled()
    })
  })
})
