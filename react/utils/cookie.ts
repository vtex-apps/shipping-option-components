export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }

  return undefined
}

export function getZipCode() {
  const segment = (window as any)?.__RUNTIME__.segmentToken

  if (!segment) {
    return
  }

  const { facets } = JSON.parse(atob(segment))

  if (!facets) {
    return
  }

  const zipCodeFacet = facets
    .split(';')
    .find((facet: string) => facet.indexOf('zip=code'))

  if (!zipCodeFacet) {
    return
  }

  const [, zipCode] = zipCodeFacet.split('=')

  if (zipCode && zipCode[zipCode.length - 1] === ';') {
    return zipCode.substring(0, zipCode.length - 1)
  }

  return zipCode
}

export function getCountryCode() {
  const segment = (window as any)?.__RUNTIME__.segmentToken

  if (!segment) {
    return
  }

  const { countryCode } = JSON.parse(atob(segment))

  return countryCode
}
