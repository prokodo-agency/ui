/**
 * Map center coordinates.
 */
export type MapCenter = {
  /** Latitude in degrees. */
  lat: number
  /** Longitude in degrees. */
  lng: number
}

/**
 * Marker coordinates.
 */
export type MapMarkerPosition = {
  /** Latitude in degrees. */
  lat: number
  /** Longitude in degrees. */
  lng: number
}

/**
 * Marker definition for Google Maps Advanced Marker.
 */
export type MapMarker = Omit<
  google.maps.marker.AdvancedMarkerElement,
  "position" | "map"
> & {
  /** Marker position coordinates. */
  position: MapMarkerPosition
}

/**
 * Map component props.
 * Renders a Google Map with optional markers.
 *
 * @example
 * <Map apiKey={GOOGLE_MAPS_KEY} center={{ lat: 48.1, lng: 11.6 }} zoom={12} />
 *
 * @example
 * <Map
 *   apiKey={GOOGLE_MAPS_KEY}
 *   center={{ lat: 48.1, lng: 11.6 }}
 *   marker={[{ position: { lat: 48.1, lng: 11.6 } }]}
 * />
 *
 * @ssr Requires client-side rendering (uses Google Maps JS API).
 */
export type MapProps = {
  /** Google Maps API key. */
  apiKey: string
  /** Optional Map ID for advanced styling. */
  mapId?: string
  /** Center coordinates. */
  center: MapCenter
  /** Marker list. */
  marker?: MapMarker[]
  /** Zoom level. */
  zoom?: number
  /** Camera heading in degrees. */
  heading?: number
  /** Camera tilt in degrees. */
  tilt?: number
}
