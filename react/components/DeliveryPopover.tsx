import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import OutsideClickHandler from 'react-outside-click-handler'
import '../styles.css'

const CSS_HANDLES = [
  'deliveryPopover',
  'popoverPolygonContainer',
  'popoverPolygonSvg',
  'popoverPolygon',
] as const

interface Props {
  onClick: () => void
  handleOutSideClick: () => void
  description: string
  buttonLabel: string
}

const DeliveryPopover = ({
  onClick,
  description,
  buttonLabel,
  handleOutSideClick,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <OutsideClickHandler onOutsideClick={handleOutSideClick}>
      <div className={`${handles.deliveryPopover}`}>
        <p className="ma0">{description}</p>
        <Button onClick={onClick}>{buttonLabel}</Button>

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
