import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@api/authApi';

const AUTH_QUERY_KEY = ['auth', 'me'];

/**
 * Fetches the currently authenticated admin. Disabled by default when
 * there's clearly no session, and configured to fail silently (401 is
 * an expected "not logged in" state, not an application error).
 */
export function useCurrentAdmin(options = {}) {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authApi.getMe().then((res) => res.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      if (res?.data?.token) {
        window.localStorage.setItem('abacus-admin-token', res.data.token);
      }
      queryClient.setQueryData(AUTH_QUERY_KEY, res?.data?.admin);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      window.localStorage.removeItem('abacus-admin-token');
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    },
  });
}

export { AUTH_QUERY_KEY };
