import { useMutation } from '@tanstack/react-query'
import { loginRequest, type LoginResponse } from '../api/auth'
import { useAuth } from './useAuth'

export function useLogin() {
  const { login } = useAuth()

  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationKey: ['login'],
      mutationFn: ({ email, password }) => loginRequest(email, password),
      onSuccess: (data: LoginResponse) => {
        login(data.token)
      },
    }
  )
}
