let query = {}
const setQuery = jest.fn((val) => {
  query = val
})

export const useRuntime = jest.fn(() => ({
  query,
  hints: {
    mobile: false,
    desktop: true,
  },
  setQuery,
}))

export const useSSR = jest.fn(() => ({
  isSSR: false,
}))

afterEach(() => {
  query = {}
  setQuery.mockClear()
})
