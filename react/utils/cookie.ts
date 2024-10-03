export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }

  return undefined
}

export function getFacetsData(facetsDataTarget: string) {
  const segment = (window as any)?.__RUNTIME__.segmentToken

  if (!segment) {
    return
  }

  const { facets } = JSON.parse(atob(segment))

  if (!facets) {
    return
  }

  const facetsTarget = facets
    .split(';')
    .find((facet: string) => facet.indexOf(facetsDataTarget) > -1)

  if (!facetsTarget) {
    return
  }

  const [, data] = facetsTarget.split('=')

  if (data && data[data.length - 1] === ';') {
    return data.substring(0, data.length - 1)
  }

  return data
}

export function getCountryCode() {
  const segment = (window as any)?.__RUNTIME__.segmentToken

  if (!segment) {
    return
  }

  const { countryCode } = JSON.parse(atob(segment))

  return countryCode
}

export function getOrderFormId() {
  const orderForm = localStorage.getItem('orderform')

  if (!orderForm) {
    return
  }

  return JSON.parse(orderForm || '{}').id
}
