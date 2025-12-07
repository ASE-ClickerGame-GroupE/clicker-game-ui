import { type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Single shared QueryClient for tests. Keeps tests simple and avoids recreating it.
const defaultClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export function QueryProviderWrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={defaultClient}>{children}</QueryClientProvider>
}

