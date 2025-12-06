import { importLibrary, setOptions } from "@googlemaps/js-api-loader"
import { useEffect, useState } from "react"

export const useGoogleMaps = (apiKey: string, reload?: boolean): boolean => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loader = async () => {
      setOptions({
        key: apiKey,
        libraries: ["maps"],
      })
      await importLibrary("maps")

      await importLibrary("marker")
        .then(() => {
          setLoaded(true)
        })
        .catch((err: ErrorOptions) => {
          console.error("Error loading Google Maps", err)
          throw new Error("Error loading Google Map: ", err)
        })
    }
    void loader()
  }, [apiKey, reload])

  return loaded
}
