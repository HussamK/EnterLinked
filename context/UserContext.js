import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';

export const UserContext = createContext();

export const UserProvider = ({ children, fetchUserModel }) => {
  const [userModel, setUserModel] = useState(null);

  if (!fetchUserModel) {
    throw new Error("fetchUserModel function must be provided");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        try {
          const fetchedUserModel = await fetchUserModel(user.uid);
          setUserModel(fetchedUserModel);
        } catch (error) {
          console.error("Failed to fetch user model:", error);
        }
      } else {
        setUserModel(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []); // Dependency array

  const updateUserModel = (newModel) => {
    setUserModel(newModel);
  }

  const clearUserModel = () => {
    setUserModel(null);
  };

  return (
    <UserContext.Provider value={{ userModel, clearUserModel, updateUserModel }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
