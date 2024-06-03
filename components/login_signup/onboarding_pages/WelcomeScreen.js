import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import styles from '../../../styles/globals';
import { Asset } from 'expo-asset';

const WelcomeScreen = ({ navigation }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [fadeAnimImage] = useState(new Animated.Value(0));
    const [fadeAnimText] = useState(new Animated.Value(0));
    const [fadeAnimButton] = useState(new Animated.Value(0));

    useEffect(() => {
        const preloadImage = async () => {
            const imageAsset = Asset.fromModule(require('../../../assets/enterlinked_logo_white.png'));
            await imageAsset.downloadAsync();
            setImageLoaded(true);
        };

        preloadImage();
    }, []);

    useEffect(() => {
        if (imageLoaded) {
            Animated.sequence([
                Animated.timing(fadeAnimImage, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.ease,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnimText, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.ease,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnimButton, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.ease,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [imageLoaded]);

    return (
        <View style={[styles.container, { backgroundColor: '#010312' }]}>
            <View style={[tw`rounded-xl p-8 w-4/5`, {}]}>
                <Text style={tw`text-center text-white text-2xl font-bold pb-4`}>Welcome to</Text>
                <View style={tw`pb-8`}>
                    <Animated.Image
                        source={require('../../../assets/enterlinked_logo_white.png')}
                        style={{ width: 250, height: 150, alignSelf: 'center', opacity: fadeAnimImage }}
                    />
                </View>
                <Animated.Text style={[tw`text-center text-white font-bold text-lg pb-8`, { opacity: fadeAnimText }]}>Let's find out a little bit more about you...</Animated.Text>
                <View style={tw`p-1 flex justify-center items-center pt-4`}>
                    <Animated.View style={{ opacity: fadeAnimButton }}>
                        <TouchableOpacity
                            style={tw`bg-red-500 w-60 h-10 rounded-full`}
                            onPress={() => navigation.navigate('Name')}
                        >
                            <Text style={tw`text-center text-white pt-3`}>Next</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

export default WelcomeScreen;
