/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import OutsideClickHandler from 'react-outside-click-handler'
import { useIntl } from 'react-intl'
import '../styles.css'

import PostalCodeInput from './PostalCodeInput'
import messages from '../messages'
import PostalCodeHelpLink from './PostalCodeHelpLink'

const CSS_HANDLES = [
  'deliveryPopover',
  'popoverPolygonContainer',
  'popoverPolygonSvg',
  'popoverPolygon',
  'popoverInputContainer',
] as const

interface Props {
  onClick: () => void
  handleOutSideClick: () => void
  variant?: 'popover-button' | 'popover-input'
  onSubmit: (zipcode: string) => void
  isLoading?: boolean
  inputErrorMessage?: string
  selectedZipcode?: string
}

const DeliveryPopover = ({
  onClick,
  handleOutSideClick,
  variant = 'popover-input',
  onSubmit,
  isLoading,
  inputErrorMessage,
  selectedZipcode,
}: Props) => {
  const [zipcode, setZipcode] = useState<string>('')
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  useEffect(() => setZipcode(selectedZipcode ?? ''), [selectedZipcode])

  return (
    <OutsideClickHandler onOutsideClick={handleOutSideClick}>
      <div
        className={`${handles.deliveryPopover}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <p className="ma0">
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
              onChange={(value: string) => setZipcode(value)}
              zipcode={zipcode}
              onSubmit={onSubmit}
              errorMessage={inputErrorMessage}
              showClearButton={false}
              placeholder={intl.formatMessage(
                messages.popoverPostalCodeInputPlaceHolder
              )}
            />
            <Button isLoading={isLoading} onClick={() => onSubmit(zipcode)}>
              {intl.formatMessage(messages.popoverSubmitButtonLabel)}
            </Button>
          </div>
        )}

        <span className={`${handles.popoverPolygonContainer}`}>
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
