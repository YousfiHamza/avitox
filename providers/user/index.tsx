'use client';

import React, { createContext, useContext } from 'react';

interface UserContextType {
  user: any; // Replace 'any' with the actual user type if available
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  user: any;
  children: React.ReactNode;
}> = ({ user, children }) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error('useUser must be used within a UserProvider');
  }
  return context;
};
