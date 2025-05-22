/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import OutsideClickHandler from 'react-outside-click-handler'
import { useIntl } from 'react-intl'
import '../styles.css'

import PostalCodeInput from './PostalCodeInput'
import messages from '../messages'
import PostalCodeHelpLink from './PostalCodeHelpLink'
import { debounce } from '../utils/debounce'

const RIGHT_MARGIN = 30

const CSS_HANDLES = [
  'deliveryPopover',
  'deliveryPopoverText',
  'popoverPolygonContainer',
  'popoverPolygonSvg',
  'popoverPolygon',
  'popoverInputContainer',
] as const

interface Props {
  onClick: () => void
  handleOutSideClick: () => void
  variant?: 'popover-button' | 'popover-input'
  onChange: (zipCode?: string) => void
  onSubmit: () => void
  isLoading?: boolean
  inputErrorMessage?: string
  zipCode?: string
  rules?: any
}

const DeliveryPopover = ({
  onClick,
  handleOutSideClick,
  variant = 'popover-input',
  onChange,
  onSubmit,
  isLoading,
  inputErrorMessage,
  zipCode,
}: Props) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  const [readjustSize, setReadjustSize] = useState(0)

  useEffect(() => {
    const adjustPopover = () => {
      if (!popoverRef.current) return

      const popoverRect = popoverRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      let size = 0

      if (popoverRect.right > viewportWidth) {
        size = popoverRect.right - viewportWidth + RIGHT_MARGIN
      } else if (popoverRect.left < 0) {
        size = popoverRect.left
      }

      setReadjustSize(size)
    }

    adjustPopover()

    const onresizeDebounce = debounce(adjustPopover, 250)

    window.addEventListener('resize', onresizeDebounce)

    return () => {
      window.removeEventListener('resize', onresizeDebounce)
    }
  }, [popoverRef])

  return (
    <OutsideClickHandler onOutsideClick={handleOutSideClick}>
      <div
        ref={popoverRef}
        style={{ left: `calc(50% - ${readjustSize}px)` }}
        className={`${handles.deliveryPopover}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <p className={`${handles.deliveryPopoverText} ma0`}>
          {`${intl.formatMessage(messages.popoverDescription)} `}
          <PostalCodeHelpLink />
        </p>

        {variant === 'popover-button' ? (
          <Button onClick={onClick}>
            {intl.formatMessage(messages.popoverButtonLabel)}
          </Button>
        ) : (
          <div className={`${handles.popoverInputContainer} flex`}>
            <PostalCodeInput
              zipCode={zipCode}
              onSubmit={onSubmit}
              errorMessage={inputErrorMessage}
              onChange={onChange}
              showClearButton={false}
              placeholder={intl.formatMessage(
                messages.popoverPostalCodeInputPlaceHolder
              )}
            />
            <Button isLoading={isLoading} onClick={onSubmit}>
              {intl.formatMessage(messages.popoverSubmitButtonLabel)}
            </Button>
          </div>
        )}

        <span
          style={{ left: `calc(50% + ${readjustSize}px)` }}
          className={`${handles.popoverPolygonContainer}`}
        >
          <svg
            className={`${handles.popoverPolygonSvg}`}
            width="25"
            height="12"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
          >
            <polygon
              className={`${handles.popoverPolygon}`}
              points="0,0 30,0 15,10"
            />
          </svg>
        </span>
      </div>
    </OutsideClickHandler>
  )
}

export default DeliveryPopover
