export type MapCenter = {
  lat: number
  lng: number
}

export type MapMarkerPosition = {
  lat: number
  lng: number
}

export type MapMarker = Omit<
  google.maps.marker.AdvancedMarkerElement,
  "position" | "map"
> & {
  position: MapMarkerPosition
}

export type MapProps = {
  apiKey: string
  mapId?: string
  center: MapCenter
  marker?: MapMarker[]
  zoom?: number
  heading?: number
  tilt?: number
}
