import React, { useRef, useEffect } from 'react';
import { View, Pressable, Text, Animated } from 'react-native';
import styles from '../styles/globals';
import tw from 'tailwind-react-native-classnames';

const Landing = ({ navigation }) => {
  const imageFadeInOpacity = useRef(new Animated.Value(0)).current;
  const buttonsFadeInOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageFadeInOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsFadeInOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#010312' }]}>
      <View style={tw`pb-40 pt-20`}>
        <Animated.Image
          source={require('../assets/enterlinked_logo_white.png')}
          style={{ width: 330, height: 243, opacity: imageFadeInOpacity }}
        />
      </View>
      <Animated.View style={{ opacity: buttonsFadeInOpacity }}>
        <View style={tw`p-1 pt-20 flex justify-center items-center`}>
          <Pressable
            style={tw`bg-red-500 w-80 h-10 rounded-full`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={tw`text-center font-bold text-white pt-3`}>Login</Text>
          </Pressable>
        </View>
        <View style={tw`p-1 flex justify-center items-center`}>
          <Pressable
            style={[tw`bg-blue-500 w-80 h-10 rounded-full`, { backgroundColor: '#6abdff' }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={tw`text-center font-bold text-white pt-3`}>Get Started</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default Landing;
