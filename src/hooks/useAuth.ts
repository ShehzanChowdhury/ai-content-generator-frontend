import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, logoutUser, clearError } from '../store/authSlice';
import { useRouter } from 'next/navigation';
import { websocketService } from '../services/websocket';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  const register = async (name: string, email: string, password: string) => {
    return dispatch(registerUser({ name, email, password })).unwrap();
  };

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
    // Disconnect WebSocket on logout
    websocketService.disconnect();
    router.push('/login');
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
}

