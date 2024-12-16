import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'
import '../styles.css'

import DeliveryPopover from './DeliveryPopover'

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
  zipCode?: string
  onChange?: (zipCode?: string) => void
  onSubmit?: () => void
  inputErrorMessage?: string
  overlayType?: OverlayType
}

const ShippingOptionButton = ({
  onClick,
  loading,
  label,
  value,
  placeholder,
  compact,
  zipCode,
  onChange,
  onSubmit,
  inputErrorMessage,
  overlayType,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)

  const handleOutSideClick = () => {
    setIsPopoverOpen(false)
  }

  const handlePopoverClick = () => {
    onClick()
    setIsPopoverOpen(false)
  }

  const showPopover =
    overlayType === 'popover-button' || overlayType === 'popover-input'

  const isFirstLoading = !zipCode && loading

  const openPopover = !isFirstLoading && !value && showPopover && isPopoverOpen

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
          onClick={handlePopoverClick}
          handleOutSideClick={handleOutSideClick}
          onChange={onChange || (() => {})}
          onSubmit={onSubmit || (() => {})}
          isLoading={loading}
          inputErrorMessage={inputErrorMessage}
          zipCode={zipCode}
          variant={overlayType}
        />
      )}
    </div>
  )
}

export default ShippingOptionButton
