/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { IconClose, Input } from 'vtex.styleguide'

import styles from '../styles.css'

interface OverlayProps {
  open: boolean
  onClose: () => void
}

const Overlay = ({ open, onClose }: OverlayProps) => (
  <div
    onClick={onClose}
    className={`${
      open ? 'db' : 'dn'
    } fixed bg-black-50 w-100 h-100 top-0 z-999`}
  />
)

interface DrawerProps {
  open: boolean
  onClose: () => void
}

const Drawer = ({ open, onClose }: DrawerProps) => (
  <div
    className={`${open ? styles['drawer--open'] : styles['drawer--close']} ${
      styles.drawer
    }  w-33 h-100 bg-white fixed right-0 top-0 z-999 pt9 pl9 pr9 pb6 flex flex-column justify-between`}
  >
    <div>
      <button
        className="bn pa0 absolute top-1 right-1 pointer bg-transparent"
        onClick={onClose}
      >
        <IconClose size={14} />
      </button>

      <p className="f3 fw6 mb4 mt0">Update shipping location</p>
      <p className="mt0 mb0 f6 dark-gray mb7">
        Item availability and shipping options will change based on location.
      </p>

      <Input size="large" placeholder="Zip code" />
    </div>
    <button
      className="bn w-100 bg-rebel-pink br-pill f6 white pa5 fw6 pointer"
      type="submit"
    >
      Update
    </button>
  </div>
)

interface Props {
  open: boolean
  onClose: () => void
}

const ShippingOptionDrawer = ({ open, onClose }: Props) => {
  return (
    <>
      <Overlay open={open} onClose={onClose} />
      <Drawer open={open} onClose={onClose} />
    </>
  )
}

export default ShippingOptionDrawer
