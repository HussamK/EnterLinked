import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, TextInput, View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'tailwind-react-native-classnames';
import styles from '../../styles/globals';
import { Asset } from 'expo-asset';
import { useUser } from '../../context/UserContext';
import { doc, getDoc } from 'firebase/firestore';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const { updateUserModel } = useUser();

  const onSignIn = () => {
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;
        
        if (user) {
          // Fetch user model data and set it in context
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            updateUserModel(userData); // Set the user model in context
          }
        }

        setError('');
      })
      .catch((error) => {
        console.log(error);
        setError('Error during sign in.');
      });
  };

  useEffect(() => {
    const preloadImage = async () => {
      const imageAsset = Asset.fromModule(require('../../assets/enterlinked_logo_white.png'));
      await imageAsset.downloadAsync();
      setImageLoaded(true);
    };

    preloadImage();
  }, []);

  if (!imageLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: '#010312' }]}>
        <View style={[tw`rounded-xl p-8 w-4/5`, { backgroundColor: '#121001' }]}>
          <View style={tw`pb-8`}>
            <Image
              source={require('../../assets/enterlinked_logo_white.png')}
              style={{ width: 250, height: 100, alignSelf: 'center' }}
            />
          </View>
          <View style={tw`p-2`}>
            <TextInput
              placeholder="email"
              onChangeText={(email) => setEmail(email)}
              style={tw`w-60 p-4 text-center shadow-lg rounded-full bg-gray-100`}
              placeholderTextColor="#b0b0b0"
            />
          </View>
          {error ? <Text>{error}</Text> : null}
          <View style={tw`p-2`}>
            <TextInput
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              style={tw`w-60 p-4 text-center shadow-lg rounded-full bg-gray-100`}
              placeholderTextColor="#b0b0b0"
            />
          </View>
          <View style={tw`p-1 flex justify-center items-center pt-4`}>
            <TouchableOpacity
              style={tw`bg-red-500 w-60 h-10 rounded-full`}
              onPress={() => onSignIn()}
            >
              <Text style={tw`text-center font-bold text-white pt-3`}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`w-60 rounded-full`}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[tw`text-center pt-3`, { color: '#ea1c0d' }]}>Don't have an account? Sign up!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
