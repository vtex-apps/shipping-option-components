import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useSSR } from 'vtex.render-runtime'

import ShippingOptionButton from './components/ShippingOptionButton'
import ShippingOptionDrawer from './components/ShippingOptionDrawer'

function Greeting() {
  const body = window?.document?.body
  const isSSR = useSSR()
  const [open, setOpen] = useState(false)
  const shouldCreatePortal = !isSSR && !!body

  if (shouldCreatePortal) {
    body.style.overflow = open ? 'hidden' : ''
  }

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <ShippingOptionButton onClick={onOpen} />
      {shouldCreatePortal
        ? createPortal(
            <ShippingOptionDrawer open={open} onClose={onClose} />,
            body
          )
        : null}
    </>
  )
}

export default Greeting
