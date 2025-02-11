import React from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import PinSlashIcon from './PinSlashIcon'
import messages from '../../messages'

const CSS_HANDLES = ['noPickupsStateContent'] as const

interface Props {
  zipCode?: string
  onClick: () => void
}

const NoPickupsState = ({ zipCode, onClick }: Props) => {
  const intl = useIntl()
  const handle = useCssHandles(CSS_HANDLES)

  return (
    <div className="flex-auto flex flex-column">
      <div className={`flex flex-column ${handle.noPickupsStateContent}`}>
        <PinSlashIcon />
        <p className="f3 fw6 mb0 mt5">
          {intl.formatMessage(messages.noPickupsStateTitle)}
        </p>
        <p className="t-small mt3 mb0 c-muted-1">
          {`${intl.formatMessage(
            messages.noPickupsStateDescription
          )} ${zipCode}`}
        </p>
      </div>

      <div className="mt8">
        <Button block onClick={onClick}>
          {intl.formatMessage(messages.noPickupsStateButtonLabel)}
        </Button>
      </div>
    </div>
  )
}

export default NoPickupsState
