import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AppID from 'ibmcloud-appid-js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAppIDInitialized, setIsAppIDInitialized] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const appID = useMemo(() => new AppID(), []);

  useEffect(() => {
    const initAppID = async () => {
      try {
        await appID.init({
          clientId: 'a1aecd93-e29f-4359-8dc0-953460f71acd',
          discoveryEndpoint: 'https://eu-de.appid.cloud.ibm.com/oauth/v4/facad6f3-96d0-4451-beda-e2b7dbc2df61/.well-known/openid-configuration'
        });
        setIsAppIDInitialized(true);
      } catch (e) {
        setErrorState(true);
        setErrorMessage('Failed to initialize AppID: ' + e.message);
      }
    };
    initAppID();
  }, [appID]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setIsAuthenticated(true);
      setAccessToken(storedToken);
      fetchUserInfo(storedToken);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserInfo(data);
      if (data.organisation) {
        localStorage.setItem('organization', data.organisation);
      }
      if (data.role) {
        localStorage.setItem('userRole', data.role);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = async () => {
    if (!isAppIDInitialized) {
      setErrorState(true);
      setErrorMessage('AppID is not initialized yet. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    try {
      const tokens = await appID.signin();
      setErrorState(false);
      setIsAuthenticated(true);
      setUserName(tokens.idTokenPayload.name);
      setAccessToken(tokens.accessToken);
      localStorage.setItem('accessToken', tokens.accessToken);
      await fetchUserInfo(tokens.accessToken);
    } catch (e) {
      setErrorState(true);
      setErrorMessage('Login failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('organization');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserName('');
    setAccessToken(null);
    setUserInfo(null);
  };

  const value = {
    isAuthenticated,
    userName,
    userInfo,
    accessToken,
    isAppIDInitialized,
    errorState,
    errorMessage,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};