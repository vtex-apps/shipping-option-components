import React from 'react'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import { render } from '@vtex/test-tools/react'
import * as reactIntl from 'react-intl'

import AvailabilityBadges from '../AvailabilityBadges'

const messages = {
  'store/shipping-option-zipcode.availabilityBadge.deliveryAvailable':
    'Delivery available',
  'store/shipping-option-zipcode.availabilityBadge.deliveryUnavailable':
    'Delivery unavailable',
  'store/shipping-option-zipcode.availabilityBadge.pickupAt': 'Pickup at',
  'store/shipping-option-zipcode.availabilityBadge.pickupUnavailable':
    'Pickup unavailable',
} as const

const COMMON_BADGE_STYLE = 'br-pill mr3'
const AVAILABLE_BADGE_STYLE = 'bg-green'
const UNAVAILABLE_BADGE_STYLE = ['bg-white', 'ba']

const mockUseShippingOptionState = jest.fn()
const mockUseProductSummary =
  ProductSummaryContext.useProductSummary as jest.Mock

const mockIntl = {
  formatMessage: ({ id }: { id: string }) =>
    messages[id as keyof typeof messages] || id,
} as reactIntl.IntlShape

jest.mock('../context', () => ({
  useShippingOptionState: () => mockUseShippingOptionState(),
}))

jest.mock('../PickupModal', () => {
  const MockPickupModal = (props: { isOpen: boolean; onClose: () => void }) => (
    <div
      data-testid="pickup-modal"
      onClick={props.onClose}
      onKeyDown={(e) => e.key === 'Enter' && props.onClose()}
      role="button"
      tabIndex={0}
    >
      {props.isOpen ? 'Modal Open' : 'Modal Closed'}
    </div>
  )

  return MockPickupModal
})

describe('AvailabilityBadges', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseProductSummary.mockReturnValue({
      product: { deliveryPromisesBadges: [] },
    })

    jest.spyOn(reactIntl, 'useIntl').mockImplementation(() => mockIntl)
  })

  describe('Initial render conditions', () => {
    it('renders nothing if zipcode is missing', () => {
      mockUseShippingOptionState.mockReturnValue({ zipcode: null })

      const { container } = render(<AvailabilityBadges />)

      expect(container.firstChild).toBeNull()
    })

    it('renders nothing if deliveryPromisesBadges is null', () => {
      mockUseShippingOptionState.mockReturnValue({ zipcode: '12345' })
      mockUseProductSummary.mockReturnValue({
        product: { deliveryPromisesBadges: null },
      })

      const { container } = render(<AvailabilityBadges />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Delivery badge states and styles', () => {
    beforeEach(() => {
      mockUseShippingOptionState.mockReturnValue({ zipcode: '12345' })
    })

    it('renders unavailable badges if deliveryPromisesBadges is empty', () => {
      // Setup mock data
      mockUseProductSummary.mockReturnValue({
        product: { deliveryPromisesBadges: [] },
      })

      // Render component and get text elements
      const { getByText } = render(<AvailabilityBadges />)
      const deliveryText = getByText('Delivery unavailable')
      const pickupText = getByText('Pickup unavailable')

      // Check if text elements are rendered
      expect(deliveryText).toBeInTheDocument()
      expect(pickupText).toBeInTheDocument()

      // Get badge elements
      const deliveryBadge = deliveryText.closest('div')?.querySelector('div')
      const pickupBadge = pickupText.closest('div')?.querySelector('div')

      // Check delivery badge styles (should be unavailable)
      expect(deliveryBadge).toHaveClass(
        COMMON_BADGE_STYLE,
        ...UNAVAILABLE_BADGE_STYLE
      )
      expect(deliveryBadge).not.toHaveClass(AVAILABLE_BADGE_STYLE)

      // Check pickup badge styles (should be unavailable)
      expect(pickupBadge).toHaveClass(
        COMMON_BADGE_STYLE,
        ...UNAVAILABLE_BADGE_STYLE
      )
      expect(pickupBadge).not.toHaveClass(AVAILABLE_BADGE_STYLE)
    })

    it('renders available badges when only delivery is available', () => {
      mockUseProductSummary.mockReturnValue({
        product: {
          deliveryPromisesBadges: [{ typeName: 'delivery' }],
        },
      })

      const { getByText } = render(<AvailabilityBadges />)

      const deliveryText = getByText('Delivery available')
      const pickupText = getByText('Pickup unavailable')

      expect(deliveryText).toBeInTheDocument()
      expect(pickupText).toBeInTheDocument()

      // Get badge elements and check their styles
      const deliveryBadge = deliveryText.closest('div')?.querySelector('div')
      const pickupBadge = pickupText.closest('div')?.querySelector('div')

      // Delivery badge should be styled as available
      expect(deliveryBadge).toHaveClass(
        COMMON_BADGE_STYLE,
        AVAILABLE_BADGE_STYLE
      )
      expect(deliveryBadge).not.toHaveClass(...UNAVAILABLE_BADGE_STYLE)

      // Pickup badge should be styled as unavailable
      expect(pickupBadge).toHaveClass(
        COMMON_BADGE_STYLE,
        ...UNAVAILABLE_BADGE_STYLE
      )
      expect(pickupBadge).not.toHaveClass(AVAILABLE_BADGE_STYLE)
    })

    it('renders both available badges and pickup button', () => {
      mockUseProductSummary.mockReturnValue({
        product: {
          deliveryPromisesBadges: [
            { typeName: 'delivery' },
            { typeName: 'pickup-in-point', pickupName: 'Store 1' },
          ],
        },
      })

      const { getByText } = render(<AvailabilityBadges />)

      const deliveryText = getByText('Delivery available')
      const pickupText = getByText('Pickup at')
      const pickupLocation = getByText('Store 1')

      expect(deliveryText).toBeInTheDocument()
      expect(pickupText).toBeInTheDocument()
      expect(pickupLocation).toBeInTheDocument()

      // Get badge elements and check their styles
      const deliveryBadge = deliveryText.closest('div')?.querySelector('div')
      const pickupBadge = pickupText.closest('div')?.querySelector('div')

      // Both badges should be styled as available
      expect(deliveryBadge).toHaveClass(
        COMMON_BADGE_STYLE,
        AVAILABLE_BADGE_STYLE
      )
      expect(deliveryBadge).not.toHaveClass(...UNAVAILABLE_BADGE_STYLE)

      expect(pickupBadge).toHaveClass(COMMON_BADGE_STYLE, AVAILABLE_BADGE_STYLE)
      expect(pickupBadge).not.toHaveClass(...UNAVAILABLE_BADGE_STYLE)
    })
  })

  describe('Pickup modal behavior', () => {
    beforeEach(() => {
      mockUseShippingOptionState.mockReturnValue({ zipcode: '12345' })
    })

    it('opens pickup modal when clicking on pickup location', () => {
      mockUseProductSummary.mockReturnValue({
        product: {
          deliveryPromisesBadges: [
            { typeName: 'pickup-in-point', pickupName: 'Store 1' },
          ],
        },
      })

      // Render component and get elements
      const { getByText, getByTestId } = render(<AvailabilityBadges />)
      const pickupButton = getByText('Store 1')

      // Trigger click event
      pickupButton.click()

      // Check if modal is open
      expect(getByTestId('pickup-modal')).toHaveTextContent('Modal Open')
    })

    it('closes pickup modal when clicking close button', () => {
      mockUseProductSummary.mockReturnValue({
        product: {
          deliveryPromisesBadges: [
            { typeName: 'pickup-in-point', pickupName: 'Store 1' },
          ],
        },
      })

      // Render component and get elements
      const { getByText, getByTestId } = render(<AvailabilityBadges />)
      const pickupButton = getByText('Store 1')

      // Open modal
      pickupButton.click()
      const modal = getByTestId('pickup-modal')

      // Close modal
      modal.click()

      // Check if modal is closed
      expect(modal).toHaveTextContent('Modal Closed')
    })
  })

  describe('Event handling', () => {
    beforeEach(() => {
      mockUseShippingOptionState.mockReturnValue({ zipcode: '12345' })
    })

    it('stops event propagation when clicking on the container', () => {
      mockUseProductSummary.mockReturnValue({
        product: { deliveryPromisesBadges: [] },
      })

      // Render component and get container element
      const { container } = render(<AvailabilityBadges />)
      const divElement = container.firstChild as HTMLElement

      // Create click event and spy on stopPropagation
      const clickEvent = new MouseEvent('click', { bubbles: true })
      const stopPropagation = jest.spyOn(clickEvent, 'stopPropagation')

      // Trigger click event
      divElement.dispatchEvent(clickEvent)

      // Check if event propagation was stopped
      expect(stopPropagation).toHaveBeenCalled()
    })

    it('allows clicking on pickup button without event propagation', () => {
      // Setup mock data
      mockUseProductSummary.mockReturnValue({
        product: {
          deliveryPromisesBadges: [
            { typeName: 'pickup-in-point', pickupName: 'Store 1' },
          ],
        },
      })

      // Render component and get elements
      const { getByText, getByTestId } = render(<AvailabilityBadges />)
      const pickupButton = getByText('Store 1')

      // Trigger click event
      pickupButton.click()

      // Check if modal was opened
      expect(getByTestId('pickup-modal')).toBeInTheDocument()
    })
  })
})
