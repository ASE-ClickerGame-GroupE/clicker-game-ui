import { type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../hooks/useAuth'

// Single shared QueryClient for tests. Keeps tests simple and avoids recreating it.
const defaultClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export function QueryProviderWrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={defaultClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
