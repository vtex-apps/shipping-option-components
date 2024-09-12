import React, { PropsWithChildren } from 'react'
import { Drawer, DrawerHeader, DrawerCloseButton } from 'vtex.store-drawer'

import '../styles.css'

interface Props {
  isLoading: boolean
  customPixelEventId: string
  title: string
  icon: React.ReactNode
  onSubmit: (zipCode?: string) => void
  inputErrorMessage?: string
}

const ShippingOptionDrawer = ({
  customPixelEventId,
  title,
  children,
  icon,
}: PropsWithChildren<Props>) => {
  return (
    <Drawer
      customIcon={icon}
      className="dn"
      slideDirection="rightToLeft"
      customPixelEventId={customPixelEventId}
      header={
        <DrawerHeader>
          <DrawerCloseButton />
        </DrawerHeader>
      }
    >
      <div className="pl8 pr8 pb6 w-100">
        <p className="f3 fw6 mb6 mt0">{title}</p>

        {children}
      </div>
    </Drawer>
  )
}

export default ShippingOptionDrawer
