import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import '../styles.css'

import DeliveryPopover from './DeliveryPopover'
import messages from '../messages'

const CSS_HANDLES = [
  'buttonWrapper',
  'buttonLabel',
  'buttonValue',
  'shippingButtonContainer',
] as const

interface Props {
  onClick: () => void
  loading: boolean
  label: string
  placeholder: string
  value?: string
  compact: boolean
  showPopover?: boolean
}

const ShippingOptionButton = ({
  onClick,
  loading,
  label,
  value,
  placeholder,
  compact,
  showPopover = false,
}: Props) => {
  const intl = useIntl()
  const [isPopoverOpen, setIsPopoverOpen] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)

  const handleOutSideClick = () => {
    setIsPopoverOpen(false)
  }

  const handlePopoverClick = () => {
    onClick()
    setIsPopoverOpen(false)
  }

  const openPopover = !loading && !value && showPopover && isPopoverOpen

  return (
    <div className={`${handles.shippingButtonContainer} flex items-center`}>
      <button
        onClick={onClick}
        className={`${handles.buttonWrapper} flex h2 items-center br3 pt3 pb3 b--none`}
      >
        {!compact && (
          <p className={`${handles.buttonLabel} ma0 c-on-base f6 mr2`}>
            {label}
          </p>
        )}
        {loading ? (
          <div className="ml4">
            <Spinner size={14} />
          </div>
        ) : (
          <p className={`${handles.buttonValue} ma0 f6 fw6 c-action-primary`}>
            {value ?? placeholder}
          </p>
        )}
      </button>
      {openPopover && (
        <DeliveryPopover
          buttonLabel={intl.formatMessage(messages.popoverButtonLabel)}
          description={intl.formatMessage(messages.popoverDescription)}
          onClick={handlePopoverClick}
          handleOutSideClick={handleOutSideClick}
        />
      )}
    </div>
  )
}

export default ShippingOptionButton
