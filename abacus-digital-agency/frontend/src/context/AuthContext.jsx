import { createContext, useContext, useMemo } from 'react';
import { useCurrentAdmin, useLogin, useLogout } from '@hooks/useAuth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const { data: admin, isLoading, isError } = useCurrentAdmin();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const value = useMemo(
    () => ({
      admin: admin || null,
      isAuthenticated: !!admin,
      isLoading,
      isError,
      login: loginMutation.mutateAsync,
      isLoggingIn: loginMutation.isPending,
      loginError: loginMutation.error,
      logout: logoutMutation.mutateAsync,
      isLoggingOut: logoutMutation.isPending,
    }),
    [admin, isLoading, isError, loginMutation, logoutMutation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
}
