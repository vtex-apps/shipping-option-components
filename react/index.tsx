/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSSR, useRuntime } from 'vtex.render-runtime'

import ShippingOptionButton from './components/ShippingOptionButton'
import ShippingOptionDrawer from './components/ShippingOptionDrawer'
import { getCountryCode, getZipCode } from './utils/cookie'

function ShippingOptionZipCode() {
  const body = window?.document?.body
  const isSSR = useSSR()
  const { account } = useRuntime()
  const shouldCreatePortal = !isSSR && !!body
  const [open, setOpen] = useState(false)
  const [zipCode, setZipCode] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [countryCode, setCountryCode] = useState<string>()
  const [inputErrorMessage, setInputErrorMessage] = useState<string>()

  useEffect(() => {
    if (isSSR) {
      return
    }

    setZipCode(getZipCode())
    setIsLoading(false)
    setCountryCode(getCountryCode)
  }, [isSSR])

  if (shouldCreatePortal) {
    body.style.overflow = open ? 'hidden' : ''
  }

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onError = (message: string) => {
    setInputErrorMessage(message)
    setIsLoading(false)

    setTimeout(() => {
      setInputErrorMessage(undefined)
    }, 3000)
  }

  const onSubmit = async (submittedZipCode?: string) => {
    if (!submittedZipCode) {
      onError('Please enter your zipcode')

      return
    }

    setZipCode(submittedZipCode)
    setIsLoading(true)

    const postalCodeCall = await fetch(
      `/api/checkout/pub/postal-code/${countryCode}/${submittedZipCode}?an=${account}`
    )

    const { geoCoordinates } = await postalCodeCall.json()

    if (geoCoordinates.length === 0) {
      onError('There are no deliveries for this region')

      return
    }

    await fetch('/api/sessions', {
      method: 'POST',
      body: `{"public":{"facets":{"value":"zip-code=${submittedZipCode};coordinates=${geoCoordinates.join(
        ','
      )}"}}}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    location.reload()
  }

  return (
    <>
      <ShippingOptionButton
        onClick={onOpen}
        zipCode={zipCode}
        loading={isLoading}
      />
      {shouldCreatePortal
        ? createPortal(
            <ShippingOptionDrawer
              open={open}
              onClose={onClose}
              onSubmit={onSubmit}
              inputErrorMessage={inputErrorMessage}
              isLoading={isLoading}
            />,
            body
          )
        : null}
    </>
  )
}

export default ShippingOptionZipCode
