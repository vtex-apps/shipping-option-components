import { SHIPPING_INFO_COOKIE } from './constants'
import { setCookie } from './utils/cookie'

/** Matches delivery-promises-bff availability body (`itemId` = SKU, `productId` = catalog product). */
export type AvailabilityItem = {
  itemId: string
  productId: string
}

const buildAvailabilityLocation = (
  zipCode: string,
  countryCode: string,
  geoCoordinates: number[]
) => ({
  zipCode,
  coordinate: {
    longitude: geoCoordinates[0],
    latitude: geoCoordinates[1],
  },
  country: countryCode,
})

const withAvailabilityScQuery = (
  baseUrlWithQuery: string,
  salesChannel?: string
) => {
  if (salesChannel == null || salesChannel.trim() === '') {
    return baseUrlWithQuery
  }

  return `${baseUrlWithQuery}&sc=${encodeURIComponent(salesChannel.trim())}`
}

export const getAddress = (
  countryCode: string,
  zipCode: string,
  account: string
) =>
  fetch(
    `/api/checkout/pub/postal-code/${countryCode}/${zipCode}?an=${account}`
  ).then((res) => res.json())

// FIXME in the future the country should not be passed here, instead it should go to session
// so this should be fixed for not to pass the country anymore
export const updateSession = async (
  countryCode: string,
  zipCode: string,
  geoCoordinates: number[],
  pickup?: Pickup,
  shippingOption?: string
) => {
  const facetsValue = `zip-code=${zipCode};country=${countryCode};coordinates=${geoCoordinates.join(
    ','
  )}${shippingOption ? `;shipping=${shippingOption}` : ''}${
    pickup ? `;pickupPoint=${pickup.pickupPoint.id}` : ''
  }`

  // __RUNTIME__.segmentToken is not reliable for the facets. It might not be updated. For this reason we must try to get the info from our custom cookie first
  // Replacing ";" by ":" because ";" is not allowed in cookies
  setCookie(SHIPPING_INFO_COOKIE, facetsValue.replace(/;/g, ':'))

  await fetch('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({
      public: {
        facets: {
          value: facetsValue,
        },
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const getPickups = (
  countryCode: string,
  zipCode: string,
  account: string,
  salesChannel: string
) =>
  fetch(
    `/api/intelligent-search/v0/pickup-point-availability/trade-policy/${encodeURIComponent(
      salesChannel
    )}?zip-code=${encodeURIComponent(zipCode)}&an=${encodeURIComponent(
      account
    )}&country=${encodeURIComponent(countryCode)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`pickup-point-availability failed (${res.status})`)
      }

      return res.json()
    })
    .then((data) => ({
      items: Array.isArray(data?.pickupPointDistances)
        ? data.pickupPointDistances.map((ppd: any) => {
            const { address } = ppd

            return {
              distance: ppd.distance,
              pickupPoint: {
                id: ppd.pickupId,
                friendlyName: ppd.pickupName,
                address: {
                  neighborhood: address.neighborhood,
                  street: address.street,
                  postalCode: address.postalCode,
                  city: address.city,
                  number: address.number,
                  state: address.state,
                },
                isActive: ppd.isActive,
              },
            }
          })
        : [],
    }))
    .catch(() => ({ items: [] }))

export const updateOrderForm = (
  country: string,
  zipCode: string,
  orderFormId: string
) =>
  fetch(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, {
    method: 'POST',
    body: `{"selectedAddresses": [{ "postalCode": "${zipCode}", "country": "${country}" }]}`,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

export const getCatalogCount = (zipCode: string, geoCoordinates: number[]) =>
  fetch(
    `/api/io/_v/api/intelligent-search/catalog_count?zip-code=${zipCode}&coordinates=${geoCoordinates.join(
      ','
    )}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    }
  ).then((res) => res.json())

export const getCartProducts = async (orderFormId: string) => {
  const orderForm = await fetch(
    `/api/checkout/pub/orderForm/${orderFormId}`
  ).then((res) => res.json())

  return orderForm.items
}

/** Maps Checkout orderForm items to BFF `items` (SKU id + catalog product id). */
export const orderFormItemsToAvailabilityItems = (
  orderFormItems: unknown[]
): AvailabilityItem[] =>
  orderFormItems.map((raw) => {
    const line = raw as { id: string | number; productId?: string | number }
    const itemId = String(line.id)
    const productId =
      line.productId != null && String(line.productId) !== ''
        ? String(line.productId)
        : itemId

    return { itemId, productId }
  })

export const removeCartProductsById = async (
  orderFormId: string,
  cartProductsIndex: number[]
) => {
  const requestBody = {
    orderItems: cartProductsIndex.map((productIndex) => ({
      quantity: 0,
      index: productIndex,
    })),
  }

  const orderForm = await fetch(
    `/api/checkout/pub/orderForm/${orderFormId}/items/update`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json())

  return orderForm.items
}

export const validateProductAvailability = async (
  zipCode: string,
  countryCode: string,
  items: AvailabilityItem[],
  account: string,
  salesChannel?: string
) => {
  const address = await getAddress(countryCode, zipCode, account)

  const requestBody = {
    location: buildAvailabilityLocation(
      zipCode,
      countryCode,
      address.geoCoordinates
    ),
    items,
  }

  const url = withAvailabilityScQuery(
    `/api/delivery-promises-bff/availability/deliveryorpickup?an=${encodeURIComponent(
      account
    )}`,
    salesChannel
  )

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

export const validateProductAvailabilityByDelivery = async (
  zipCode: string,
  countryCode: string,
  items: AvailabilityItem[],
  account: string,
  salesChannel?: string
) => {
  const address = await getAddress(countryCode, zipCode, account)

  const requestBody = {
    location: buildAvailabilityLocation(
      zipCode,
      countryCode,
      address.geoCoordinates
    ),
    items,
  }

  const url = withAvailabilityScQuery(
    `/api/delivery-promises-bff/availability/delivery?an=${encodeURIComponent(
      account
    )}`,
    salesChannel
  )

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

export const validateProductAvailabilityByPickup = async (
  pickupId: string,
  items: AvailabilityItem[],
  zipCode: string,
  countryCode: string,
  account: string,
  salesChannel?: string
) => {
  await getAddress(countryCode, zipCode, account)

  const requestBody = {
    items,
  }

  const url = withAvailabilityScQuery(
    `/api/delivery-promises-bff/availability/pickupid?an=${encodeURIComponent(
      account
    )}&pickupId=${encodeURIComponent(pickupId)}`,
    salesChannel
  )

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}
