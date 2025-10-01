import React, { useEffect, useState } from 'react'
import { Link } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'

import EmptyState from './EmptyState'
import PinIcon from './PinIcon'
import messages from '../messages'

interface LocationDetectorButton {
  className?: string
  variation?: 'primary' | 'secondary' | 'tertiary'
}

const getGeolocation = async (): Promise<any> => {
  if (!navigator?.geolocation) {
    throw new Error('Geolocation not supported')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

const LocationDetectorButton: React.FC<LocationDetectorButton> = ({
  className,
  variation = 'tertiary',
}) => {
  const [regionId, setRegionId] = useState<string>('')

  const {
    culture: { country },
    route: { path, queryString },
  } = useRuntime()

  const intl = useIntl()

  useEffect(() => {
    const getCurrentPosition = async (): Promise<void> => {
      try {
        const position = await getGeolocation()
        const { latitude, longitude } = position.coords

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const postcode = data.address?.postcode || data.address?.postal_code

        if (postcode) {
          const cep = postcode.replace(/-/g, '')
          const newRegionId = btoa(`vtex:${country}:${cep}`)

          setRegionId(newRegionId)
        }
      } catch (error) {
        throw new Error(`Regionalization error! ${error.message}`)
      }
    }

    if (regionId || !navigator?.geolocation) return

    getCurrentPosition()
  }, [country, regionId])

  if (queryString?.region_id) {
    return null
  }

  if (!regionId) {
    return (
      <div className={className}>
        <EmptyState
          description={intl.formatMessage(
            messages.LocationDetectorButtonLoadingDescription
          )}
          variant="secondary"
          useIcon={false}
        />
      </div>
    )
  }

  const separator = Object.keys(queryString).length === 0 ? '?' : '&'
  const href = `${path}${separator}region_id=${regionId}`

  // TO-DO:
  // css handles and formatting
  // reenable logic to false on show
  // map new prop in documentation
  // tests

  return (
    <Link variation={variation} href={href} className={className}>
      <PinIcon filled={false} />
      {intl.formatMessage(messages.LocationDetectorButtonTitle)}
    </Link>
  )
}

export default LocationDetectorButton
