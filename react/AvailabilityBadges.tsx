import React, { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import { useCssHandles } from 'vtex.css-handles'

import messages from './messages'
import { useShippingOptionState } from './context'

const CSS_HANDLES = [
  'availabilityBadgeCircle',
  'availabilityPickupButton',
] as const

const DELIVERY_BADGE_KEY = 'delivery'
const PICKUP_BADGE_KEY = 'pickup-in-point'

type Props = {
  isAvailable: boolean
}

const Badge = ({ children, isAvailable }: PropsWithChildren<Props>) => {
  const handle = useCssHandles(CSS_HANDLES)

  const cicleColor = isAvailable ? 'bg-green' : 'bg-white ba'

  return (
    <div className="flex items-center mt2">
      <div
        className={`${handle.availabilityBadgeCircle} br-pill mr3  ${cicleColor}`}
      />
      <p className="ma0 f6 mid-gray">{children}</p>
    </div>
  )
}

const AvailabilityBadges = () => {
  const intl = useIntl()
  const { zipcode } = useShippingOptionState()
  const {
    product: { deliveryPromisesBadges },
  } = ProductSummaryContext.useProductSummary()

  if (!zipcode || !deliveryPromisesBadges) {
    return null
  }

  const deliveryBadge = deliveryPromisesBadges.find(
    (badge) => badge.typeName === DELIVERY_BADGE_KEY
  )

  const pickupBadge = deliveryPromisesBadges.find(
    (badge) => badge.typeName === PICKUP_BADGE_KEY
  )

  return (
    <div>
      {deliveryBadge ? (
        <Badge isAvailable>
          {intl.formatMessage(messages.deliveryAvailableBadge)}
        </Badge>
      ) : (
        <Badge isAvailable={false}>
          {intl.formatMessage(messages.deliveryUnavailableBadge)}
        </Badge>
      )}
      {pickupBadge ? (
        <Badge isAvailable>
          {`${intl.formatMessage(messages.pickupAtBadge)} `}
          <span className="c-action-primary">{pickupBadge.pickupName}</span>
        </Badge>
      ) : (
        <Badge isAvailable={false}>
          {intl.formatMessage(messages.pickupUnavailableBadge)}
        </Badge>
      )}
    </div>
  )
}

export default AvailabilityBadges
