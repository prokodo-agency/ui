import "@types/google.maps"

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    gtag: (...args: unknown[]) => void
    Calendly?: {
      initInlineWidget: (options: {
        url: string
        parentElement: HTMLDivElement | null
        resize?: boolean
        prefill?: Record<string>
      }) => void
    }
  }
  interface ImportMeta {
    glob<T = unknown>(
      glob: string,
      options?: {
        as?: string
        eager?: boolean
        import?: string
      }
    ): Record<string, () => Promise<T>>
  }
}
