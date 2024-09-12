import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import '../styles.css'

interface Props {
  pickup: Pickup
  onClick: () => void
  selected: boolean
}

const CSS_HANDLES = ['pickupItem', 'pickupItemSelected'] as const

const PickupItem = ({ pickup, onClick, selected }: Props) => {
  const {
    distance,
    pickupPoint: {
      friendlyName,
      address: { city, neighborhood, number, postalCode, street },
    },
  } = pickup

  const handle = useCssHandles(CSS_HANDLES)

  return (
    <button
      className={`${handle.pickupItem} ${
        selected ? handle.pickupItemSelected : ''
      } relative`}
      onClick={onClick}
    >
      <p className="f4 tl ma0 fw6 mb2">{friendlyName}</p>
      <p className="mid-gray f6 ma0 tl">{`${number} ${street}`}</p>
      <p className="mid-gray f6 ma0 tl">{`${neighborhood}, ${city}, ${postalCode}`}</p>
      <span className="mid-gray absolute top-1 right-1">
        {distance.toFixed(1)} Km
      </span>
    </button>
  )
}

export default PickupItem
