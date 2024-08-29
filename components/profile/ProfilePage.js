import { Text, View, Pressable, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import { signOutUser } from '../../firebaseConfig.js';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { doc, getDoc} from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig.js';
import tw from 'tailwind-react-native-classnames';
import TabContent from './TabContent';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllBooks } from '../../api/googleImplementation.js';
import { useUser } from '../../context/UserContext.js';
import { getFollowersCount, getFollowingCount } from '../../api/userRelations.js';

const ProfilePage = () => {
  const user = useContext(AuthContext); // firebase user stuff
  const { userModel } = useUser(); // Get userModel from context
  const [followData, setFollowData] = useState({});
  const [booklist, setBooklist] = useState([]);
  const [movielist, setMovielist] = useState([]);
  const [tvlist, setTvlist] = useState([]);
  const [gamelist, setGamelist] = useState([]);
  const [musiclist, setMusiclist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageOpacity] = useState(new Animated.Value(0));
  let ranked = 0;

  // Animation for profile picture fade-in
  useEffect(() => {
    if (!loading && userModel?.profilePicture) {
      // Reset opacity
      imageOpacity.setValue(0);

      // Start fade-in animation
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [loading, userModel?.profilePicture]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        if (user) {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const followers = await getFollowersCount(user.uid);
            const following = await getFollowingCount(user.uid);
      
            // Fetch books from the bookList subcollection
            const booklist = await fetchAllBooks(user.uid);
            
            setBooklist(booklist)
            setMovielist([])
            setTvlist([])
            setGamelist([])
            setMusiclist([])

            setFollowData({ followers, following });
          }
        }
        setLoading(false);
      };

      fetchUserData();
    }, [user])
  );

  const logout = async () => {
    await signOutUser();
  }

  const editProfile = async () => {
    console.log("I am spam");
  }

  return (
    <>
      {loading ? (
        <View style={[tw`flex-1 justify-center items-center`, {backgroundColor: '#010312'}]}>
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      ) : (
        <ScrollView 
          style={[tw`flex-1`, { backgroundColor: '#010312' }]} 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80, paddingTop: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={tw`p-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={[tw`w-24 h-24 border-2 rounded-full mr-4 bg-gray-900`, { borderColor: '#ff0000' }]}>
                {userModel?.profilePicture && (
                  <Animated.Image
                    source={{ uri: userModel.profilePicture }}
                    style={[
                      tw`w-full h-full rounded-full`,
                      { opacity: imageOpacity }
                    ]}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-lg font-bold text-white`, {color: '#6abdff'}]}>{userModel?.name || 'Loading...'}</Text>
                <Text style={tw`text-sm text-white`}>{userModel?.bio || 'Loading...'}</Text>
              </View>
            </View>
            <View style={tw`w-full flex justify-center items-center pb-4 flex-row`}>
              <Pressable
                style={[tw`w-40 h-10 rounded-lg mr-2`, { backgroundColor: '#6abdff' }]}
                onPress={() => editProfile()}
              >
                <Text style={tw`text-center font-bold text-white pt-3`}>Edit Profile</Text>
              </Pressable>
              <Pressable
                style={[tw`w-40 h-10 rounded-lg`, { backgroundColor: '#ff0000' }]}
                onPress={logout}
              >
                <Text style={tw`text-center font-bold text-white pt-3`}>Logout</Text>
              </Pressable>
            </View>
            <View style={tw`flex-row justify-between items-center px-6`}>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{followData.followers}</Text>
                <Text style={[tw`text-xs`,{color: '#6abdff'}]}>Followers</Text>
              </View>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{followData.following}</Text>
                <Text style={[tw`text-xs`,{color: '#6abdff'}]}>Following</Text>
              </View>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{ranked}</Text>
                <Text style={[tw`text-xs`,{color: '#6abdff'}]}>Ranked</Text>
              </View>
            </View>
          </View>
          <View style={{ borderBottomWidth: 2, borderBottomColor: '#ff0000' }}></View>
          <TabContent 
            booklist={booklist} 
            movielist={movielist} 
            tvlist={tvlist} 
            gamelist={gamelist} 
            musiclist={musiclist} 
          />
        </ScrollView>
      )}
    </>
  );
};

export default ProfilePage;
