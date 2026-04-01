declare module 'vtex.session-client' {
  interface SessionNamespaceField {
    value?: string
  }

  interface SessionNamespaces {
    store?: {
      channel?: SessionNamespaceField
    }
  }

  interface RenderSession {
    namespaces?: SessionNamespaces
  }

  export function useRenderSession(): {
    loading: boolean
    session?: RenderSession
    error?: unknown
  }
}
