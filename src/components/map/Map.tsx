"use client"
import { type FC, memo, useEffect, useState, useCallback, useRef } from "react"

import { isString, isArray } from "@/helpers/validations"
import { useGoogleMaps } from "@/hooks/useGoogleMaps"

import { Skeleton } from "../skeleton"

import type { MapProps, MapMarker } from "./Map.model"

export const Map: FC<MapProps> = memo(
  ({ apiKey, mapId, center, marker, zoom = 8 }) => {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstanceRef = useRef<google.maps.Map | null>(null)
    const [isDark, setIsDark] = useState(
      typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-theme") === "dark"
        : false,
    )

    const initMap = useCallback(() => {
      if (!mapRef?.current) return
      const options = {
        center,
        zoom,
        mapId: isString(mapId)
          ? mapId
          : isDark === true
            ? "c3c70a1ea4c4b0b8"
            : "e5921eca3f70ade2",
        disableDefaultUI: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
      } as google.maps.MapOptions
      const map = new google.maps.Map(mapRef.current as HTMLElement, options)
      mapInstanceRef.current = map
      if (!isArray(marker)) return
      marker.forEach((place: MapMarker) => {
        if (
          typeof place?.position?.lat === "number" ||
          typeof place?.position?.lng === "number"
        )
          return
        const content = document.createElement("img")
        content.src = "/images/prokodo-map-marker.webp"
        new google.maps.marker.AdvancedMarkerElement({
          map,
          content,
          ...place,
        })
      })
    }, [isDark, mapId, center, marker, zoom])

    const loaded = useGoogleMaps(apiKey, isDark)

    useEffect(() => {
      if (!loaded || mapInstanceRef.current) return
      initMap()
    }, [loaded, initMap])

    useEffect(() => {
      const observer = new MutationObserver(() => {
        const theme = document.documentElement.getAttribute("data-theme")
        setIsDark(theme === "dark")
        mapInstanceRef.current = null
        initMap()
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      })

      return () => observer.disconnect()
    }, [initMap])

    if (!loaded) {
      return <Skeleton height="500px" width="100%" />
    }
    return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
  },
)

Map.displayName = "Map"
