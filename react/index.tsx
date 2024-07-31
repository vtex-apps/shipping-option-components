/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSSR } from 'vtex.render-runtime'

import ShippingOptionButton from './components/ShippingOptionButton'
import ShippingOptionDrawer from './components/ShippingOptionDrawer'
import { getCookie, setCookie } from './utils/cookie'

const SHIPPING_ZIPCODE_COOKIE = 'shipping-zipcode'

function ShippingOptionZipCode() {
  const body = window?.document?.body
  const isSSR = useSSR()
  const shouldCreatePortal = !isSSR && !!body
  const [open, setOpen] = useState(false)
  const [zipCode, setZipCode] = useState<string>()

  useEffect(() => {
    if (isSSR) {
      return
    }

    setZipCode(getCookie(SHIPPING_ZIPCODE_COOKIE))
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

  const onSubmit = (submittedZipCode: string) => {
    setZipCode(submittedZipCode)
    setCookie(SHIPPING_ZIPCODE_COOKIE, submittedZipCode)
    location.reload()
  }

  return (
    <>
      <ShippingOptionButton onClick={onOpen} zipCode={zipCode} />
      {shouldCreatePortal
        ? createPortal(
            <ShippingOptionDrawer
              open={open}
              onClose={onClose}
              onSubmit={onSubmit}
            />,
            body
          )
        : null}
    </>
  )
}

export default ShippingOptionZipCode
