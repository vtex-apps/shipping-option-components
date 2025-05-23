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
  placeholder: string
  value?: React.ReactNode
  zipCode?: string
  onChange?: (zipCode?: string) => void
  onSubmit?: () => void
  inputErrorMessage?: string
  callToAction?: CallToAction
  mode: Mode
  icon: React.ReactNode
}

const ShippingOptionButton = ({
  onClick,
  loading,
  value,
  placeholder,
  zipCode,
  onChange,
  onSubmit,
  inputErrorMessage,
  callToAction,
  mode,
  icon,
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

  const isFirstLoading = !zipCode && loading

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
        {loading ? (
          <div className="ml4">
            <Spinner size={14} />
          </div>
        ) : mode === 'default' ? (
          <p className={`${handles.buttonValue} ma0 f6 fw6 c-action-primary`}>
            {value ?? placeholder}
          </p>
        ) : (
          icon
        )}
      </button>
      {openPopover && (
        <DeliveryPopover
          onClick={handlePopoverClick}
          handleOutSideClick={handleOutSideClick}
          onChange={onChange ?? (() => {})}
          onSubmit={onSubmit ?? (() => {})}
          isLoading={loading}
          inputErrorMessage={inputErrorMessage}
          zipCode={zipCode}
          variant={popoverOverlay}
        />
      )}
    </div>
  )
}

export default ShippingOptionButton
