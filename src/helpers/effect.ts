/**
 * Throttle function using requestAnimationFrame to ensure smoothe updates, like onScroll, e.g.
 */
export const throttleLayoutEffect = <T extends (...args: unknown[]) => void>(
  callback: T,
): ((...args: Parameters<T>) => void) => {
  let ticking = false

  return (...args: Parameters<T>) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(...args)
        ticking = false
      })
      ticking = true
    }
  }
}
