import { useMutation } from '@tanstack/react-query'
import { registerRequest, type RegisterResponse } from '../../api/auth/auth.ts'

export function useRegister() {
  return useMutation<RegisterResponse, Error, { login: string; email: string; password: string }>({
    mutationKey: ['register'],
    mutationFn: async ({
      login,
      email,
      password,
    }: {
      login: string
      email: string
      password: string
    }) => registerRequest(login, email, password),
  })
}
