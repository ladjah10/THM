/**
 * Simple admin authentication hook for persisting login state across admin pages
 * Uses localStorage to maintain the authentication state between page navigations
 */

export function useAdminAuth() {
  // Check if localStorage is available
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
  
  // Function to set the admin authentication state
  const setAdminAuth = (isAuthenticated: boolean) => {
    if (isLocalStorageAvailable) {
      if (isAuthenticated) {
        localStorage.setItem('admin_authenticated', 'true');
      } else {
        localStorage.removeItem('admin_authenticated');
      }
    }
  };
  
  // Function to check if the admin is authenticated
  const isAdminAuthenticated = (): boolean => {
    if (isLocalStorageAvailable) {
      return localStorage.getItem('admin_authenticated') === 'true';
    }
    return false;
  };
  
  // Validation function for admin credentials
  const validateAdminCredentials = (username: string, password: string): boolean => {
    // Admin credentials hardcoded for simplicity
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "100marriage";
    
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  };
  
  return {
    setAdminAuth,
    isAdminAuthenticated,
    validateAdminCredentials
  };
}