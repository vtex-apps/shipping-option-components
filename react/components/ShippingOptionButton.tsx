import React, { useEffect, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'
import { usePopoverStore } from '@ariakit/react'

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
  selectedZipcode?: string
  onSubmit?: (zipCode: string) => void
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
  selectedZipcode,
  onSubmit,
  inputErrorMessage,
  callToAction,
  mode,
  icon,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)
  const popoverStore = usePopoverStore({ defaultOpen: false })
  const anchorRef = useRef(null)

  const popoverOverlay =
    callToAction === 'popover-button' || callToAction === 'popover-input'
      ? callToAction
      : undefined

  const isFirstLoading = !selectedZipcode && loading

  const openPopover =
    !isFirstLoading && !value && !!popoverOverlay && isPopoverOpen

  useEffect(() => {
    if (anchorRef.current) {
      popoverStore.setAnchorElement(anchorRef.current)
      popoverStore.setOpen(openPopover)
    }
  }, [openPopover, popoverStore])

  const handlePopoverClick = () => {
    onClick()
    setIsPopoverOpen(false)
  }

  return (
    <div
      className={`${handles.shippingButtonContainer} flex items-center h-100`}
    >
      <button
        ref={anchorRef}
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
      <DeliveryPopover
        onClick={handlePopoverClick}
        onSubmit={onSubmit ?? (() => {})}
        isLoading={loading}
        inputErrorMessage={inputErrorMessage}
        selectedZipcode={selectedZipcode}
        variant={popoverOverlay}
        popoverStore={popoverStore}
      />
    </div>
  )
}

export default ShippingOptionButton
