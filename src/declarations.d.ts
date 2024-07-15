declare module 'cozy-ui/*'

declare module 'cozy-ui/transpiled/react' {
  export const logger: {
    info: (message: string, ...rest: unknown[]) => void
  }
}

declare module 'cozy-ui/transpiled/react/providers/I18n' {
  export const useI18n: () => {
    t: (key: string, options?: Record<string, unknown>) => string
  }
}
