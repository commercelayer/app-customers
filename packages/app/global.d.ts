export {}

declare global {
  interface Window {
    clAppConfig: {
      domain: string
      gtmId?: string
    }
  }
}
