import { useNavigation } from '@react-navigation/native';
import React, { useRef, useContext } from 'react';
import { Text, View, Image, Pressable, Animated } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useFollow } from '../../context/FollowingContext';
import { followUser, unfollowUser, addUserPostsToFeedInChunks, removeUserPostsFromFeedInChunks } from '../../api/userRelations';
import { AuthContext } from '../../context/AuthContext';

const UserCard = ({ user }) => {
  const animationValue = useRef(new Animated.Value(1)).current;
  const currentUser = useContext(AuthContext)
  const navigation = useNavigation();
  const { followedUsers, setFollowedUsers } = useFollow();

  const isFollowing = !!followedUsers[user.uid];

  const goToUserPage = async () => {
    navigation.navigate('UserPage', { userData: user });
  };

  const toggleFollow = async () => {
    Animated.timing(animationValue, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(async () => { 
        if (isFollowing) {
          try {
            await unfollowUser(currentUser.uid, user.uid);

            // Remove user's posts from the feed when unfollowing
            await removeUserPostsFromFeedInChunks(currentUser.uid, user.uid);

            const updatedFollowedUsers = {...followedUsers};
            delete updatedFollowedUsers[user.uid];
            setFollowedUsers(updatedFollowedUsers);
          } catch (error) {
            console.error('Error unfollowing user:', error);
          }
        } else {
          try {
            await followUser(currentUser.uid, user.uid);

            // Add user's posts to the feed when following
            await addUserPostsToFeedInChunks(currentUser.uid, user.uid, 50); // Using 30 as the initial number of posts to fetch.

            setFollowedUsers({
              ...followedUsers,
              [user.uid]: true,
            });
          } catch (error) {
            console.error('Error following user:', error);
          }
        }
      });
    });
  };

  const animatedStyles = {
    transform: [{ scale: animationValue }],
    backgroundColor: isFollowing ? '#ff0000' : '#6abdff',
  };

  return (
    <Pressable onPress={goToUserPage}>
      <View style={tw`flex-row items-center justify-between border-b border-gray-900 p-4`}>
        <View style={tw`flex-row items-center`}>
          <Image
            style={[tw`w-16 h-16 border-2 rounded-full`, { borderColor: '#6abdff' }]}
            source={{ uri: user.profilePicture }}
          />
          <Text style={tw`ml-4 text-sm font-bold text-white`}>{user.name}</Text>
        </View>

        <View style={tw`pr-2`}>
          <Pressable onPress={toggleFollow}>
            <Animated.View style={[tw`w-20 h-8 rounded-md flex items-center justify-center`, animatedStyles]}>
              <Text style={tw`text-center text-white`}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default UserCard;

