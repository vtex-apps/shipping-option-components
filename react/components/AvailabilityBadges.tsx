import React, { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'
// import { ProductSummaryContext } from 'vtex.product-summary-context'
import { useCssHandles } from 'vtex.css-handles'

import messages from '../messages'

const CSS_HANDLES = ['availabilityBadgeCircle'] as const

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
  // const { product } = ProductSummaryContext.useProductSummary()

  const product = {
    deliveryPromisesBadges: ['pickup-in-point:Pickup Biggy 1', 'delivery'],
  }

  const deliveryBadge = product.deliveryPromisesBadges.find((badge: string) =>
    badge.includes(DELIVERY_BADGE_KEY)
  )

  const pickupBadge = product.deliveryPromisesBadges.find((badge: string) =>
    badge.includes(PICKUP_BADGE_KEY)
  )

  let pickupPoint

  if (pickupBadge) {
    ;[, pickupPoint] = pickupBadge.split(':')
  }

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
      {pickupPoint ? (
        <Badge isAvailable>
          {`${intl.formatMessage(messages.pickupAtBadge)} `}
          <span className="c-action-primary">{pickupPoint}</span>
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
