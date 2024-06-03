import React, { createContext } from 'react';

const OnboardingContext = createContext({
    completedOnboarding: true,
    setCompletedOnboarding: () => { },
});

export const OnboardingProvider = OnboardingContext.Provider;
export const OnboardingConsumer = OnboardingContext.Consumer;

export default OnboardingContext;