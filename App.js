import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../EnterLinked/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import OnboardingContext, { OnboardingProvider } from '../EnterLinked/context/OnboardingContext';
import Tabs from '../EnterLinked/components/Tabs';
import { UserProvider } from '../EnterLinked/context/UserContext';
import { AuthContext } from '../EnterLinked/context/AuthContext';
import { FollowProvider } from '../EnterLinked/context/FollowingContext';
import AuthStack from '../EnterLinked/components/AuthStack';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const RootStack = createStackNavigator();

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [initializing, setInitializing] = useState(true);
//   const [completedOnboarding, setCompletedOnboarding] = useState(false);

//   return (
//     <NavigationContainer>
//       <RootStack.Navigator screenOptions={{ headerShown: (false) }}>
//             <RootStack.Screen
//               name="Main"
//               component={Tabs}
//               options={{ headerShown: false }}
//             />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      // Only proceed if the user is not null
      if (user) {
        setUser(user);
  
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          setCompletedOnboarding(userDocSnap.data().onboarded);
        }
      } else {
        // Handle user being null (i.e., user is signed out)
        setUser(null); // or some other action
      }
  
      if (initializing) setInitializing(false);
    });
  
    // Make sure to unsubscribe when the component is unmounted
    return () => unsubscribeAuth();
  }, []);

  const fetchUserModel = async (userId) => {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      return null;
    }
  };

  return (
    <NavigationContainer>
    <UserProvider fetchUserModel={fetchUserModel}>
      <OnboardingProvider value={{ onboardingComplete: () => setCompletedOnboarding(true), setCompletedOnboarding }}>
        <AuthContext.Provider value={user}>
            <FollowProvider>
              <StatusBar style="light" /> 
              <RootStack.Navigator screenOptions={{ headerShown: (false) }}>
                {user ? (
                  completedOnboarding ? (
                    <RootStack.Screen
                      name="Main"
                      component={Tabs}
                      options={{ headerShown: false }}
                    />
                  ) : (
                    <RootStack.Screen
                      name="Onboarding"
                      options={{ headerShown: false }}
                    >
                      {() => (
                        <OnboardingContext.Provider value={{ onboardingComplete: () => setCompletedOnboarding(true) }}>
                          <OnboardingNavigator />
                        </OnboardingContext.Provider>
                      )}
                    </RootStack.Screen>
                  )
                ) : (
                  <RootStack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }}
                  />
                )}
              </RootStack.Navigator>
            </FollowProvider>
        </AuthContext.Provider>
      </OnboardingProvider>
    </UserProvider>
    </NavigationContainer>
  );
};

export default App;
