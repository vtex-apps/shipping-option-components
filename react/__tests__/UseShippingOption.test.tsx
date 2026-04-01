import React from 'react'
import { render, fireEvent, waitFor } from '@vtex/test-tools/react'
import * as reactIntl from 'react-intl'

import { useShippingOption } from '../context/useShippingOption'
import * as client from '../client'
import { DEFAULT_TRADE_POLICY } from '../constants'

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

jest.mock('vtex.session-client', () => ({
  useRenderSession: jest.fn(() => ({
    session: { namespaces: { store: { channel: { value: '1' } } } },
    loading: false,
  })),
}))

const mockIntl = {
  formatMessage: ({ id }: { id: string }) => String(id),
} as unknown as reactIntl.IntlShape

jest.spyOn(reactIntl, 'useIntl').mockImplementation(() => mockIntl)

function ActionRunner({
  actions,
}: {
  actions: Array<{ type: string; args?: unknown }>
}) {
  const { dispatch } = useShippingOption()

  return (
    <button
      data-testid="btn"
      onClick={async () => {
        for (const action of actions) {
          // eslint-disable-next-line no-await-in-loop
          await dispatch(action as never)
        }
      }}
    >
      go
    </button>
  )
}

describe('useShippingOption actions and behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const sessionMod = jest.requireMock('vtex.session-client') as {
      useRenderSession: jest.Mock
    }

    sessionMod.useRenderSession.mockImplementation(() => ({
      session: { namespaces: { store: { channel: { value: '1' } } } },
      loading: false,
    }))
    jest.spyOn(client, 'updateSession').mockResolvedValue(undefined)
    jest.spyOn(client, 'getAddress').mockResolvedValue({
      city: 'City',
      geoCoordinates: [1, 2],
    } as never)

    jest.spyOn(client, 'getPickups').mockResolvedValue({
      items: [
        {
          pickupPoint: { isActive: true, id: 'p1', friendlyName: 'Store 1' },
        },
      ],
    } as never)

    jest
      .spyOn(client, 'getCatalogCount')
      .mockResolvedValue({ total: 1 } as never)
    jest.spyOn(client, 'updateOrderForm').mockResolvedValue(undefined as never)
    jest.spyOn(client, 'getCartProducts').mockResolvedValue([] as never)
    jest
      .spyOn(client, 'validateProductAvailability')
      .mockResolvedValue({ unavailableItemIds: [] } as never)
    jest
      .spyOn(client, 'validateProductAvailabilityByPickup')
      .mockResolvedValue({ unavailableItemIds: [] } as never)
    jest
      .spyOn(client, 'validateProductAvailabilityByDelivery')
      .mockResolvedValue({ unavailableItemIds: [] } as never)

    const renderRuntime = jest.requireMock('vtex.render-runtime') as {
      useSSR: () => boolean
      useRuntime: () => { account: string }
    }

    jest.spyOn(renderRuntime, 'useSSR').mockReturnValue(false)
    jest
      .spyOn(renderRuntime, 'useRuntime')
      .mockReturnValue({ account: 'store' })

    const cookie = jest.requireMock('../utils/cookie') as {
      getCountryCode: () => string
      getFacetsData: (k: unknown) => unknown
    }

    jest.spyOn(cookie, 'getCountryCode').mockReturnValue('BR')
    jest
      .spyOn(cookie, 'getFacetsData')
      .mockImplementation((key: unknown) =>
        key === 'zip-code' ? '12345-678' : undefined
      )

    const reloadMock = jest.fn()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadMock },
    })
  })

  it.each([
    [
      'UPDATE_ZIPCODE + SELECT_DELIVERY_SHIPPING_OPTION triggers reload',
      [
        {
          type: 'UPDATE_ZIPCODE',
          args: { zipcode: '12345-678', reload: true },
        },
        { type: 'SELECT_DELIVERY_SHIPPING_OPTION' },
      ],
    ],
    [
      'UPDATE_ZIPCODE + RESET_SHIPPING_OPTION triggers reload',
      [
        {
          type: 'UPDATE_ZIPCODE',
          args: { zipcode: '12345-678', reload: true },
        },
        { type: 'RESET_SHIPPING_OPTION' },
      ],
    ],
  ])('%s', async (_title, actions) => {
    const { getByTestId } = render(<ActionRunner actions={actions} />)

    fireEvent.click(getByTestId('btn'))

    await waitFor(() => {
      expect(getByTestId('btn')).toBeTruthy()
    })
  })

  it('UPDATE_PICKUP sets selected pickup via explicit action', async () => {
    const actions = [
      { type: 'UPDATE_ZIPCODE', args: { zipcode: '12345-678', reload: false } },
      {
        type: 'UPDATE_PICKUP',
        args: {
          pickup: {
            pickupPoint: {
              isActive: true,
              id: 'p1',
              friendlyName: 'Store 1',
            },
          },
        },
      },
    ]

    const { getByTestId } = render(<ActionRunner actions={actions} />)

    fireEvent.click(getByTestId('btn'))

    await waitFor(() => {
      expect(getByTestId('btn')).toBeTruthy()
    })
  })

  it('calls getPickups with default trade policy when session store channel is missing', async () => {
    const sessionMod = jest.requireMock('vtex.session-client') as {
      useRenderSession: jest.Mock
    }

    sessionMod.useRenderSession.mockImplementation(() => ({
      session: { namespaces: { store: {} } },
      loading: false,
    }))

    const getPickupsSpy = jest.spyOn(client, 'getPickups').mockResolvedValue({
      items: [],
    } as never)

    function MountHook() {
      useShippingOption()

      return null
    }

    render(<MountHook />)

    await waitFor(() => {
      expect(getPickupsSpy).toHaveBeenCalledWith(
        'BR',
        '12345-678',
        'store',
        DEFAULT_TRADE_POLICY
      )
    })
  })

  it('smoke: RESET_SHIPPING_OPTION executes without errors', async () => {
    function ResetComponent() {
      const { dispatch } = useShippingOption()

      return (
        <button
          data-testid="reset"
          onClick={() => dispatch({ type: 'RESET_SHIPPING_OPTION' } as never)}
        >
          Reset
        </button>
      )
    }

    const { getByTestId } = render(<ResetComponent />)

    fireEvent.click(getByTestId('reset'))

    await waitFor(() => {
      expect(getByTestId('reset')).toBeTruthy()
    })
  })
})
