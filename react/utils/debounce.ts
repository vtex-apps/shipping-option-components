export const debounce = (callback: (value?: any) => void, wait: number) => {
  let timeoutId: number

  return (value?: any) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(value)
    }, wait)
  }
}
