import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import OnboardingContext from '../../../context/OnboardingContext';
import { FIREBASE_AUTH, FIREBASE_STORAGE } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '../../../context/UserContext';
import tw from 'tailwind-react-native-classnames';
import styles from '../../../styles/globals';

const UploadImageScreen = ({ navigation, route }) => {
    const [image, setImage] = useState(null);
    const { name, bio } = route.params;
    const { updateUserModel } = useUser();
    const uid = FIREBASE_AUTH.currentUser.uid;
    const email = FIREBASE_AUTH.currentUser.email;

    const { onboardingComplete } = useContext(OnboardingContext);

    const saveUserData = async () => {
        try {
            const userData = {
                uid: uid,
                email: email,
                name: name,
                bio: bio,
                profilePicture: image,
                onboarded: true,
            }
            await setDoc(doc(FIRESTORE_DB, 'users', uid), userData);
            updateUserModel(userData);
        } catch (error) {
            console.error('Error adding user data:', error);
        }
    };
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;

            const manipulatorResult = await ImageManipulator.manipulateAsync(
                selectedImageUri,
                [{ resize: { width: 400 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
    
            const imageRef = ref(FIREBASE_STORAGE, `profilePictures/${uid}/photo.jpg`);
            const blob = await fetch(manipulatorResult.uri).then(response => response.blob());
    
            const uploadTaskSnapshot = await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
    
            setImage(downloadURL);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor: '#010312' }]}>
                <View style={[tw`rounded-xl p-8 w-4/5`, { backgroundColor: '#121001' }]}>
                    <View style={tw`flex-shrink`}>
                        <Text style={[tw`text-center text-white text-2xl font-bold`]}>Upload your profile image:</Text>
                    </View>
                    <View style={tw`mt-4 flex-grow justify-center items-center`}>
                        <TouchableOpacity onPress={pickImage} style={tw`bg-red-500 w-60 h-10 rounded-full mb-4`}>
                            <Text style={tw`text-center text-white pt-3`}>Choose Image</Text>
                        </TouchableOpacity>
                        {image && (
                            <View style={[tw`w-36 h-36 rounded-full border-2 shadow-md mb-4`, { borderColor: '#6abdff' }]}>
                                <Image source={{ uri: image }} style={tw`w-full h-full rounded-full`} />
                            </View>
                        )}
                    </View>
                    <View style={[tw`flex-row justify-between items-center`]}>
                        <TouchableOpacity
                            style={tw`bg-red-500 w-24 h-10 rounded-full`}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={tw`text-center text-white pt-3`}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-red-500 w-24 h-10 rounded-full`}
                            onPress={() => {
                                saveUserData();
                                onboardingComplete();
                            }}
                        >
                            <Text style={tw`text-center text-white pt-3`}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default UploadImageScreen;
