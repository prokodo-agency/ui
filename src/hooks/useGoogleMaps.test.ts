import { importLibrary, setOptions } from "@googlemaps/js-api-loader"
import { act, renderHook } from "@testing-library/react"

import { useGoogleMaps } from "./useGoogleMaps"

jest.mock("@googlemaps/js-api-loader", () => ({
  importLibrary: jest.fn(),
  setOptions: jest.fn(),
}))

const mockImportLibrary = importLibrary as jest.MockedFunction<
  typeof importLibrary
>
const mockSetOptions = setOptions as jest.MockedFunction<typeof setOptions>

describe("useGoogleMaps", () => {
  beforeEach(() => {
    mockImportLibrary.mockResolvedValue({} as google.maps.MapsLibrary)
    mockSetOptions.mockImplementation(() => undefined)
  })

  it("returns false initially before maps load", async () => {
    const { result } = renderHook(() => useGoogleMaps("test-api-key"))
    expect(result.current).toBe(false)
    // Flush pending promises to avoid act() warning
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })
  })

  it("calls setOptions with the API key and loads maps + marker", async () => {
    const { result } = renderHook(() => useGoogleMaps("my-api-key"))

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(mockSetOptions).toHaveBeenCalledWith({
      key: "my-api-key",
      libraries: ["maps"],
    })
    expect(mockImportLibrary).toHaveBeenCalledWith("maps")
    expect(mockImportLibrary).toHaveBeenCalledWith("marker")
    expect(result.current).toBe(true)
  })

  it("re-runs when reload flag changes", async () => {
    const { result, rerender } = renderHook(
      ({ reload }: { reload: boolean }) => useGoogleMaps("test-key", reload),
      { initialProps: { reload: false } },
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(result.current).toBe(true)

    mockImportLibrary.mockClear()
    rerender({ reload: true })

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(mockImportLibrary).toHaveBeenCalled()
  })

  it("handles importLibrary error for marker (logs and stays false)", async () => {
    mockImportLibrary
      .mockResolvedValueOnce({} as google.maps.MapsLibrary) // maps OK
      .mockRejectedValueOnce(new Error("marker load error")) // marker fails

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    const { result } = renderHook(() => useGoogleMaps("test-key"))

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading Google Maps",
      expect.any(Error),
    )
    expect(result.current).toBe(false)
  })
})
