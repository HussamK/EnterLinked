import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './onboarding_pages/WelcomeScreen';
import NameScreen from './onboarding_pages/NameScreen';
import BioScreen from './onboarding_pages/BioScreen';
import UploadImageScreen from './onboarding_pages/UploadImageScreen';

const OnboardingStack = createNativeStackNavigator();

const OnboardingNavigator = ({ onboardingComplete }) => {
    return (
        <OnboardingStack.Navigator initialRouteName="Welcome" screenOptions={{ headerMode: 'none' }}>
            <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
            <OnboardingStack.Screen name="Name" component={NameScreen} options={{headerShown: false}}/>
            <OnboardingStack.Screen name="Bio" component={BioScreen} options={{headerShown: false}}/>
            <OnboardingStack.Screen name="UploadImage" component={UploadImageScreen} options={{headerShown: false}}/>
        </OnboardingStack.Navigator>
    );
};

export default OnboardingNavigator;
