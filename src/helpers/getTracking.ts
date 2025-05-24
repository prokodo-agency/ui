export type Tracking = {
  gclid?: string | null
  gaClientId?: string | null
}

export const getTracking = (): Tracking | null => {
  if (typeof document !== "undefined") {
    const element = document.documentElement
    const gclid = element.getAttribute("data-gclid")
    const gaClientId = element.getAttribute("data-gaclientid")
    return {
      gclid,
      gaClientId,
    }
  }
  return null
}
