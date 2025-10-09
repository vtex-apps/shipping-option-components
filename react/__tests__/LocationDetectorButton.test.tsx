import React from 'react'
import { render, waitFor } from '@vtex/test-tools/react'
import * as reactIntl from 'react-intl'

import LocationDetectorButton from '../components/LocationDetectorButton'

const messages = {
  'store/shipping-option-zipcode.LocationDetectorButton.title':
    'Use my location',
  'store/shipping-option-zipcode.LocationDetectorButtonLoading.description':
    'Detecting location...',
  'store/shipping-option-zipcode.LocationDetectorButtonError.description':
    'Location detection failed',
} as const

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

// Mock fetch
const mockFetch = jest.fn()

// Mock useRuntime
const mockUseRuntime = jest.fn()

// Mock useCssHandles
const mockUseCssHandles = jest.fn()

// Mock intl
const mockIntl = {
  formatMessage: ({ id }: { id: string }) =>
    messages[id as keyof typeof messages] || id,
} as reactIntl.IntlShape

// Mock modules
jest.mock('vtex.render-runtime', () => ({
  useRuntime: () => mockUseRuntime(),
}))

jest.mock('vtex.css-handles', () => ({
  useCssHandles: () => mockUseCssHandles(),
}))

jest.mock('../components/EmptyState', () => {
  const MockEmptyState = ({ description }: { description: string }) => (
    <div data-testid="empty-state">{description}</div>
  )

  return MockEmptyState
})

jest.mock('../components/PinIcon', () => {
  const MockPinIcon = ({ filled }: { filled: boolean }) => (
    <span
      data-testid="pin-icon"
      data-filled={filled}
      role="img"
      aria-label="pin icon"
    />
  )

  return MockPinIcon
})

describe('LocationDetectorButton', () => {
  // Shared test data
  const mockCoordinates = { latitude: -23.5505, longitude: -46.6333 }
  const mockPostcode = '01310-100'

  // Helper functions
  const mockSuccessfulGeolocation = () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: mockCoordinates })
    })
  }

  const mockGeolocationError = (errorMessage = 'Geolocation denied') => {
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(new Error(errorMessage))
    })
  }

  const mockSuccessfulFetch = (postcode = mockPostcode) => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ address: { postcode } }),
    })
  }

  const mockFailedFetch = (status = 500) => {
    mockFetch.mockResolvedValue({ ok: false, status })
  }

  // Helper functions that return render results for simpler usage
  const renderWithSuccessfulLocationDetection = () => {
    mockSuccessfulGeolocation()
    mockSuccessfulFetch()

    return render(<LocationDetectorButton />)
  }

  const renderWithGeolocationError = () => {
    mockGeolocationError()

    return render(<LocationDetectorButton />)
  }

  const renderWithAPIError = () => {
    mockSuccessfulGeolocation()
    mockFailedFetch()

    return render(<LocationDetectorButton />)
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    Object.defineProperty(global, 'navigator', {
      value: { geolocation: mockGeolocation },
      writable: true,
    })

    global.fetch = mockFetch

    mockUseRuntime.mockReturnValue({
      culture: { country: 'BRA' },
      route: { path: '/products', queryString: {} },
    })

    mockUseCssHandles.mockReturnValue({
      locationDetectorButton: 'locationDetectorButton',
      locationDetectorButtonContainer: 'locationDetectorButtonContainer',
      locationDetectorButtonIcon: 'locationDetectorButtonIcon',
    })

    jest.spyOn(reactIntl, 'useIntl').mockImplementation(() => mockIntl)

    // Mock btoa
    jest.spyOn(global, 'btoa').mockImplementation((str) => `encoded-${str}`)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initial render conditions', () => {
    it('renders nothing when region_id already exists in queryString', () => {
      mockUseRuntime.mockReturnValue({
        culture: { country: 'BRA' },
        route: {
          path: '/products',
          queryString: { region_id: 'existing-region' },
        },
      })

      const { container } = render(<LocationDetectorButton />)

      expect(container.firstChild).toBeNull()
    })

    it('renders loading state initially when no regionId is set', () => {
      const { getByTestId, getByText } = render(<LocationDetectorButton />)

      expect(getByTestId('empty-state')).toBeInTheDocument()
      expect(getByText('Detecting location...')).toBeInTheDocument()
    })

    it('renders loading state when geolocation is not supported', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      })

      const { getByTestId } = render(<LocationDetectorButton />)

      expect(getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  describe('Geolocation functionality', () => {
    it('calls geolocation API on mount when available', () => {
      render(<LocationDetectorButton />)

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('renders location button after successful geolocation and API call', async () => {
      const { getByText, getByTestId } = renderWithSuccessfulLocationDetection()

      await waitFor(() => {
        expect(getByText('Use my location')).toBeInTheDocument()
        expect(getByTestId('pin-icon')).toBeInTheDocument()
      })
    })

    it('handles geolocation error gracefully', async () => {
      const { getByTestId, getByText } = renderWithGeolocationError()

      await waitFor(() => {
        expect(getByTestId('empty-state')).toBeInTheDocument()
        expect(getByText('Location detection failed')).toBeInTheDocument()
      })
    })

    it('handles API error gracefully', async () => {
      const { getByTestId, getByText } = renderWithAPIError()

      await waitFor(() => {
        expect(getByTestId('empty-state')).toBeInTheDocument()
        expect(getByText('Location detection failed')).toBeInTheDocument()
      })
    })

    it('shows error state with icon when location detection fails', async () => {
      const { container } = renderWithGeolocationError()

      await waitFor(() => {
        const emptyState = container.querySelector(
          '[data-testid="empty-state"]'
        )

        expect(emptyState).toBeInTheDocument()
      })
    })

    it('maintains error state after geolocation failure', async () => {
      const { getByText } = renderWithGeolocationError()

      await waitFor(() => {
        expect(getByText('Location detection failed')).toBeInTheDocument()
      })

      // Error state should persist since the component doesn't automatically retry
      expect(getByText('Location detection failed')).toBeInTheDocument()
    })
  })

  describe('Link generation and navigation', () => {
    // All tests in this group use successful location detection
    beforeEach(() => {
      mockSuccessfulGeolocation()
      mockSuccessfulFetch()
    })

    it('generates correct href with ? separator for empty queryString', async () => {
      mockUseRuntime.mockReturnValue({
        culture: { country: 'BRA' },
        route: { path: '/products', queryString: {} },
      })

      const { getByRole } = render(<LocationDetectorButton />)

      await waitFor(() => {
        const link = getByRole('link')

        expect(link).toHaveAttribute(
          'href',
          '/products?region_id=encoded-vtex:BRA:01310100'
        )
      })
    })

    it('generates correct href with & separator for existing queryString', async () => {
      mockUseRuntime.mockReturnValue({
        culture: { country: 'BRA' },
        route: { path: '/products', queryString: { category: 'electronics' } },
      })

      const { getByRole } = render(<LocationDetectorButton />)

      await waitFor(() => {
        const link = getByRole('link')

        expect(link).toHaveAttribute(
          'href',
          '/products&region_id=encoded-vtex:BRA:01310100'
        )
      })
    })

    it('handles postal codes with hyphens correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            address: { postcode: '01310-100' },
          }),
      })

      const { getByRole } = render(<LocationDetectorButton />)

      await waitFor(() => {
        const link = getByRole('link')

        // Should remove hyphens from postal code
        expect(link).toHaveAttribute(
          'href',
          '/products?region_id=encoded-vtex:BRA:01310100'
        )
      })
    })

    it('handles alternative postal_code field from API', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            address: { postal_code: '90210' },
          }),
      })

      const { getByRole } = render(<LocationDetectorButton />)

      await waitFor(() => {
        const link = getByRole('link')

        expect(link).toHaveAttribute(
          'href',
          '/products?region_id=encoded-vtex:BRA:90210'
        )
      })
    })
  })

  describe('CSS handles and styling', () => {
    it('applies CSS handles correctly', async () => {
      const { container } = renderWithSuccessfulLocationDetection()

      // Check loading container handle
      expect(
        container.querySelector('.locationDetectorButtonContainer')
      ).toBeInTheDocument()

      // Check button and icon handles after successful load
      await waitFor(() => {
        expect(
          container.querySelector('.locationDetectorButton')
        ).toBeInTheDocument()
        expect(
          container.querySelector('.locationDetectorButtonIcon')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Component behavior edge cases', () => {
    it('handles missing postcode in API response', async () => {
      mockSuccessfulGeolocation()
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ address: {} }), // No postcode
      })

      const { getByTestId } = render(<LocationDetectorButton />)

      await waitFor(() => {
        // Should continue showing loading state when no postcode (not an error)
        expect(getByTestId('empty-state')).toBeInTheDocument()
      })
    })
  })
})
