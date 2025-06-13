import React from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import PinSlashIcon from './PinSlashIcon'

const CSS_HANDLES = ['noPickupsStateContent'] as const

interface Props {
  onClick?: () => void
  title: string
  description: string
  buttonLabel: string
  variant?: 'primary' | 'secondary'
}

const EmptyState = ({
  onClick,
  title,
  description,
  buttonLabel,
  variant = 'primary',
}: Props) => {
  const handle = useCssHandles(CSS_HANDLES)

  return (
    <div className="flex-auto flex flex-column">
      <div
        style={{ margin: 'auto 0' }}
        className={`flex flex-column ${
          variant === 'primary' ? 'items-center' : 'items-start'
        } ${handle.noPickupsStateContent}`}
      >
        <PinSlashIcon color={variant === 'primary' ? '#979899' : '#000000'} />
        <p className="f3 fw6 mb0 mt5">{title}</p>
        <p className="t-small mt3 mb0 c-muted-1">{description}</p>
      </div>
      {onClick && (
        <div className="mt8">
          <Button block onClick={onClick}>
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
