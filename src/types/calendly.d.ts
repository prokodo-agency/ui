export {}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: Record<string, string>
        utm?: Record<string, string>
        branding?: boolean
        hideEventTypeDetails?: boolean
        hideLandingPageDetails?: boolean
        hideGdprBanner?: boolean
        pageSettings?: Record<string, string>
        textColor?: string
        primaryColor?: string
      }) => void
    }
  }
}
