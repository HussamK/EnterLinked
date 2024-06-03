import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/login_signup/Login';
import Register from '../components/login_signup/Register';
import Landing from '../components/LandingPage'; // replace './Landing' with the correct path

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default AuthStack;
