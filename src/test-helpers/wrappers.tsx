import { type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../hooks/useAuth/useAuth.tsx'
import { MemoryRouter } from 'react-router'

const defaultClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export function QueryProviderWrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={defaultClient}>
      <AuthProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
