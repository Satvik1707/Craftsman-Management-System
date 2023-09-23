import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../utils/cookies';
import { fetchUserData } from '../utils/api/users';
import jwt_decode from 'jwt-decode';

const SERVER_URL = 
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL_PROD
    : process.env.NEXT_PUBLIC_SERVER_URL_DEV;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = getCookie('token');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const isAdmin = currentUser?.role === 'admin';
  const router = useRouter();

  const logout = () => {
    removeCookie('token');
    setCurrentUser(null);
    router.push('/auth/login');
  };

  const fetchCurrentUserData = async (token) => {
    try {
      if (token) {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          const response = await fetchUserData(SERVER_URL, token);
          setCurrentUser(response.data);
        }
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setIsLoading(false); // Set isLoading to false after data fetching
    }
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUserData(token);
    } else {
      setIsLoading(false); // Set isLoading to false if no token
    }
  }, [token]);

  const login = async (username, password) => {
    setIsLoading(true);
    removeCookie('token');

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const response  = await axios.post(
        `${SERVER_URL}api/login`,
        { username, password },
        config
      );

      const token = response.data.token;
      // console.log(token);
      setCookie('token', token, 3);
      await fetchCurrentUserData(token);
      router.push('/Routes');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated: isAuthenticated(),
        login,
        logout,
        error,
        SERVER_URL,
        token,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
