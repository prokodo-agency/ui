export type Tracking = {
  gclid?: string | null
  gaClientId?: string | null
}

export const getTracking = (): Tracking | null => {
  /* istanbul ignore next */
  if (typeof document === "undefined") {
    return null
  }
  const element = document.documentElement
  const gclid = element.getAttribute("data-gclid")
  const gaClientId = element.getAttribute("data-gaclientid")
  return {
    gclid,
    gaClientId,
  }
}
