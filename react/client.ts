export const getAddress = (
  countryCode: string,
  zipCode: string,
  account: string
) =>
  fetch(
    `/api/checkout/pub/postal-code/${countryCode}/${zipCode}?an=${account}`
  ).then((res) => res.json())

export const updateSession = (
  zipCode: string,
  geoCoordinates: number[],
  pickup?: Pickup
) =>
  fetch('/api/sessions', {
    method: 'POST',
    body: `{"public":{"facets":{"value":"zip-code=${zipCode};coordinates=${geoCoordinates.join(
      ','
    )}${pickup ? `;pickupPoint=${pickup.pickupPoint.id}` : ''}"}}}`,
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const getPickups = (
  countryCode: string,
  zipCode: string,
  account: string
) =>
  fetch(
    `/api/checkout/pub/pickup-points?an=${account}&countryCode=${countryCode}&postalCode=${zipCode}`
  ).then((res) => res.json())
