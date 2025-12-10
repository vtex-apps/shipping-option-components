import { getCatalogCount } from '../client'

describe('client.getCatalogCount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses credentials: "omit" and does not attach cookies', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) })

    ;(global as any).fetch = mockFetch

    await getCatalogCount('12345-678', [0, 0])

    expect(mockFetch).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line prefer-destructuring
    const [, options] = mockFetch.mock.calls[0]

    expect(options).toMatchObject({
      method: 'GET',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
    })

    // Ensure no Cookie header is forwarded
    expect(options.headers).not.toHaveProperty('Cookie')
  })
})
