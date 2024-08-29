import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFollowingList } from '../api/userRelations';
import { AuthContext } from './AuthContext';

// 1. Creating the context
export const FollowContext = createContext();

// 2. Creating a Provider
export const FollowProvider = ({ children }) => {
  const [followedUsers, setFollowedUsers] = useState({});
  const user = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      const fetchFollowedUsers = async () => {
        const followingList = await getFollowingList(user.uid);
  
        const followedUsersMap = {};
  
        followingList.forEach((userId) => {
          followedUsersMap[userId] = true;
        });
  
        setFollowedUsers(followedUsersMap);
      };
  
      fetchFollowedUsers();
    } else {
      setFollowedUsers({});
    }
  }, [user]);
  

  return (
    <FollowContext.Provider value={{ followedUsers, setFollowedUsers }}>
      {children}
    </FollowContext.Provider>
  );
};

// 3. Custom hook to use the FollowContext, makes it easier to import and use
export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
