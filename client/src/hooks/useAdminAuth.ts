/**
 * Shared admin authentication hook for persisting login state across admin pages
 * Uses localStorage to maintain the authentication state between page navigations
 * This ensures users stay logged in when moving between different admin pages
 */

import { useState, useEffect } from 'react';

export function useAdminAuth() {
  // Check if localStorage is available
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
  
  // Track authentication state with useState for reactivity
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (isLocalStorageAvailable) {
      return localStorage.getItem('admin_authenticated') === 'true';
    }
    return false;
  });
  
  // Function to set the admin authentication state
  const setAdminAuth = (authStatus: boolean) => {
    if (isLocalStorageAvailable) {
      if (authStatus) {
        localStorage.setItem('admin_authenticated', 'true');
      } else {
        localStorage.removeItem('admin_authenticated');
      }
      setIsAuthenticated(authStatus);
    }
  };
  
  // Function to check if the admin is authenticated - returns current state
  const isAdminAuthenticated = (): boolean => {
    return isAuthenticated;
  };
  
  // Update authentication state if localStorage changes in another tab/window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_authenticated') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Validation function for admin credentials
  const validateAdminCredentials = (username: string, password: string): boolean => {
    // Admin credentials hardcoded for simplicity
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "100marriage";
    
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  };
  
  return {
    isAuthenticated,
    setAdminAuth,
    isAdminAuthenticated,
    validateAdminCredentials
  };
}