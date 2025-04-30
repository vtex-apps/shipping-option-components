import { SHIPPING_INFO_COOKIE } from './constants'
import { setCookie } from './utils/cookie'

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
  account: string
) =>
  fetch(
    `/api/checkout/pub/pickup-points?an=${account}&countryCode=${countryCode}&postalCode=${zipCode}`
  ).then((res) => res.json())

export const updateOrderForm = (
  country: string,
  zipCode: string,
  orderFormId: string
) =>
  fetch(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, {
    method: 'POST',
    body: `{"selectedAddresses": [{ "postalCode": ${zipCode}, "country": "${country}" }]}`,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

export const getCartProducts = async (orderFormId: string) => {
  const orderForm = await fetch(
    `/api/checkout/pub/orderForm/${orderFormId}`
  ).then((res) => res.json())

  return orderForm.items
}

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
