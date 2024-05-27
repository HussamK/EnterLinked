import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import { AuthContext } from '../context/AuthContext';
// import OnboardingContext, { OnboardingProvider } from '../context/OnboardingContext';
// import Tabs from '../components/Tabs';
// import AuthStack from '../components/AuthStack';
// import OnboardingNavigator from '../components/login_signup/OnboardingStack';
import { createStackNavigator } from '@react-navigation/stack';
 // import { FollowProvider } from '../context/FollowingContext';
// import { UserProvider } from '../context/UserContext';

const RootStack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  // useEffect(() => {
  //   const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
  //     // Only proceed if the user is not null
  //     if (user) {
  //       setUser(user);
  
  //       const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
  //       const userDocSnap = await getDoc(userDocRef);
  
  //       if (userDocSnap.exists()) {
  //         setCompletedOnboarding(userDocSnap.data().onboarded);
  //       }
  //     } else {
  //       // Handle user being null (i.e., user is signed out)
  //       setUser(null); // or some other action
  //     }
  
  //     if (initializing) setInitializing(false);
  //   });
  
  //   // Make sure to unsubscribe when the component is unmounted
  //   return () => unsubscribeAuth();
  // }, []);

  // const fetchUserModel = async (userId) => {
  //   const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  //   const userDocSnap = await getDoc(userDocRef);
  //   if (userDocSnap.exists()) {
  //     return userDocSnap.data();
  //   } else {
  //     return null;
  //   }
  // };

  return (
      <View>
        <Text>Welcome to EnterLinked!</Text>
        <StatusBar style="auto" />
      </View>
    );
};

export default App;