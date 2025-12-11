export const getAddress = async () => ({ geoCoordinates: [0, 0], city: 'City' })

export const getCatalogCount = async () => ({ total: 1 })

export const getPickups = async () => ({
  items: [{ pickupPoint: { isActive: true, id: 'p1' } }],
})

export const updateOrderForm = async () => undefined

export const updateSession = async (
  _countryCode: string,
  _zipCode: string,
  _geoCoordinates: number[],
  _pickup?: unknown,
  _shippingOption?: string
) => undefined

export const getCartProducts = async () => []

export const removeCartProductsById = async () => undefined

export const validateProductAvailability = async () => ({
  unavailableProducts: [],
})

export const validateProductAvailabilityByPickup = async () => ({
  unavailableProducts: [],
})

export const validateProductAvailabilityByDelivery = async () => ({
  unavailableProducts: [],
})
