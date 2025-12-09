import { useMutation } from '@tanstack/react-query'
import { registerRequest } from '../../api/auth/auth.ts'

export function useRegister() {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => registerRequest(email, password),
  })
}
