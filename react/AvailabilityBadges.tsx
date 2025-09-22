import type { PropsWithChildren } from 'react'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import { useCssHandles } from 'vtex.css-handles'

import messages from './messages'
import { useShippingOptionState } from './context'
import PickupModal from './PickupModal'

const CSS_HANDLES = [
  'availabilityBadgeCircle',
  'availabilityPickupButton',
] as const

const BADGE_TYPES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup-in-point',
} as const

const BADGE_STYLES = {
  AVAILABLE: 'bg-green',
  UNAVAILABLE: 'bg-white ba',
} as const

type Props = {
  isAvailable: boolean
}

const Badge = ({ children, isAvailable }: PropsWithChildren<Props>) => {
  const handle = useCssHandles(CSS_HANDLES)

  return (
    <div className="flex items-center mt2">
      <div
        className={`${handle.availabilityBadgeCircle} br-pill mr3 ${
          isAvailable ? BADGE_STYLES.AVAILABLE : BADGE_STYLES.UNAVAILABLE
        }`}
      />
      <p className="ma0 f6 mid-gray truncate">{children}</p>
    </div>
  )
}

const AvailabilityBadges = () => {
  const handle = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false)
  const { zipcode } = useShippingOptionState()
  const {
    product: { deliveryPromisesBadges },
  } = ProductSummaryContext.useProductSummary()

  if (!zipcode || !deliveryPromisesBadges) {
    return null
  }

  const findBadgeByType = (
    type: (typeof BADGE_TYPES)[keyof typeof BADGE_TYPES]
  ) => deliveryPromisesBadges.find((badge) => badge.typeName === type)

  const deliveryBadge = findBadgeByType(BADGE_TYPES.DELIVERY)
  const pickupBadge = findBadgeByType(BADGE_TYPES.PICKUP)

  const handleContainerEvents = (
    e: React.MouseEvent | React.KeyboardEvent
  ): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      onClick={handleContainerEvents}
      onKeyDown={(e) => e.key === 'Enter' && handleContainerEvents(e)}
      role="presentation"
    >
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
          <button
            onClick={() => setIsPickupModalOpen(true)}
            className={handle.availabilityPickupButton}
          >
            {pickupBadge.pickupName}
          </button>
        </Badge>
      ) : (
        <Badge isAvailable={false}>
          {intl.formatMessage(messages.pickupUnavailableBadge)}
        </Badge>
      )}

      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
    </div>
  )
}

export default AvailabilityBadges
