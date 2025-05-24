import { Loader } from "@googlemaps/js-api-loader"
import { useEffect, useState } from "react"

export const useGoogleMaps = (apiKey: string, reload?: boolean): boolean => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["maps"],
    })

    loader
      .importLibrary("marker")
      .then(() => {
        setLoaded(true)
      })
      .catch((err: ErrorOptions) => {
        console.error("Error loading Google Maps", err)
        throw new Error("Error loading Google Map: ", err)
      })
  }, [reload])

  return loaded
}
