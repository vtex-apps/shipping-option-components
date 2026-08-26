import { getCatalogCount } from '../client'
import { USER_AGENT } from '../constants'

describe('client.getCatalogCount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls intsch v1 catalog-count with identity header and without cookies', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) })

    ;(global as any).fetch = mockFetch

    await getCatalogCount('12345-678', [0, 0])

    expect(mockFetch).toHaveBeenCalledTimes(1)

    const [url, options] = mockFetch.mock.calls[0]

    expect(url).toBe(
      '/api/intelligent-search/v1/catalog-count?zip-code=12345-678&coordinates=0,0'
    )
    expect(options).toMatchObject({
      method: 'GET',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'x-vtex-user-agent': USER_AGENT,
      },
    })
    expect(options.headers).not.toHaveProperty('Cookie')
  })
})
