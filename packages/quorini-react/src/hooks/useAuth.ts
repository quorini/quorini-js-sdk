import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a QAuth.Provider');
  }
  return context;
};
