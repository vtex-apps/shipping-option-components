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
  label: React.ReactNode
  placeholder: string
  value?: React.ReactNode
  compact: boolean
  selectedZipcode?: string
  onSubmit?: (zipCode: string) => void
  inputErrorMessage?: string
  callToAction?: CallToAction
}

const ShippingOptionButton = ({
  onClick,
  loading,
  label,
  value,
  placeholder,
  compact,
  selectedZipcode,
  onSubmit,
  inputErrorMessage,
  callToAction,
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

  const popoverOverlay =
    callToAction === 'popover-button' || callToAction === 'popover-input'
      ? callToAction
      : undefined

  const isFirstLoading = !selectedZipcode && loading

  const openPopover =
    !isFirstLoading && !value && !!popoverOverlay && isPopoverOpen

  return (
    <div
      className={`${handles.shippingButtonContainer} flex items-center h-100`}
    >
      <button
        onClick={onClick}
        className={`${handles.buttonWrapper} flex items-center br3 pt4 pr4 pb4 pl0 b--none`}
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
          onSubmit={onSubmit ?? (() => {})}
          isLoading={loading}
          inputErrorMessage={inputErrorMessage}
          selectedZipcode={selectedZipcode}
          variant={popoverOverlay}
        />
      )}
    </div>
  )
}

export default ShippingOptionButton
