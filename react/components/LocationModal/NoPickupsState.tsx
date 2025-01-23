import React from 'react'
import { Button } from 'vtex.styleguide'

interface NoPickupsStateProps {
  zipCode?: string
  onClick: () => void
}

const NoPickupsState = ({ zipCode, onClick }: NoPickupsStateProps) => {
  return (
    <div className="flex-auto flex flex-column justify-between">
      <div className="flex flex-column">
        <p className="f3 fw6 ma0">Store unavailable in region</p>
        <p className="t-small mt3 mb0 c-muted-1">
          {`There are no products available for CEP ${zipCode}`}
        </p>
      </div>
      <Button onClick={onClick}>Eenter another location</Button>
    </div>
  )
}

export default NoPickupsState
