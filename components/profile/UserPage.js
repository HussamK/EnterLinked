import {
  Text,
  View,
  Pressable,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import tw from "tailwind-react-native-classnames";
import TabContent from "./TabContent";
import {
  getFollowersCount,
  getFollowingCount,
  followUser,
  unfollowUser,
  addUserPostsToFeedInChunks,
  removeUserPostsFromFeedInChunks,
} from "../../api/userRelations.js";
import { AuthContext } from "../../context/AuthContext.js";
import { useFollow } from "../../context/FollowingContext";
import { fetchAllBooks } from "../../api/googleImplementation.js";

const UserPage = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const userData = route.params?.userData;
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [booklist, setBooklist] = useState([]);
  const [movielist, setMovielist] = useState([]);
  const [tvlist, setTvlist] = useState([]);
  const [gamelist, setGamelist] = useState([]);
  const [musiclist, setMusiclist] = useState([]);

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const user = useContext(AuthContext);
  const { followedUsers, setFollowedUsers } = useFollow();
  const isFollowed = !!followedUsers[userData.uid];

  useEffect(() => {
    if (!user) return;
    const fetchFollowData = async () => {
      try {
        const followers = await getFollowersCount(userData.uid);
        const following = await getFollowingCount(userData.uid);
        const booklist = await fetchAllBooks(userData.uid);

        setFollowing(following);
        setFollowers(followers);
        setBooklist(booklist);

        setLoading(false);

        // Fade in animation for the profile picture
        if (userData?.profilePicture) {
          Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchFollowData();
  }, [user?.uid, userData.uid, followedUsers]);

  const handleFollow = async () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isFollowed) {
      try {
        await unfollowUser(user.uid, userData.uid);
        // Remove posts of unfollowed user from the feed
        await removeUserPostsFromFeedInChunks(user.uid, userData.uid);
        setFollowers(followers - 1);
        setFollowedUsers({
          ...followedUsers,
          [userData.uid]: false,
        });
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    } else {
      try {
        await followUser(user.uid, userData.uid);
        // Add posts of followed user to the feed
        await addUserPostsToFeedInChunks(user.uid, userData.uid, 50);
        setFollowers(followers + 1);
        setFollowedUsers({
          ...followedUsers,
          [userData.uid]: true,
        });
      } catch (error) {
        console.error("Error following user:", error);
      }
    }
  };

  let ranked = 0;

  return (
    <>
      {loading ? (
        <View
          style={[
            tw`flex-1 justify-center items-center`,
            { backgroundColor: "#010312" },
          ]}
        >
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      ) : (
        <ScrollView
          style={[tw`flex-1`, { backgroundColor: "#010312" }]}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 80,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={tw`p-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              {userData.profilePicture && (
                <Animated.Image
                  source={{ uri: userData.profilePicture }}
                  style={[
                    tw`w-24 h-24 border-2 bg-gray-900 rounded-full mr-4`,
                    { borderColor: "#f44336", opacity: imageOpacity },
                  ]}
                />
              )}
              <View style={tw`flex-1`}>
                <Text
                  style={[
                    tw`text-lg font-bold text-white`,
                    { color: "#6abdff" },
                  ]}
                >
                  {userData.name}
                </Text>
                <Text style={tw`text-sm text-white`}>{userData.bio}</Text>
              </View>
            </View>
            <View style={tw`w-full flex justify-center items-center pb-4`}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                  style={[
                    tw`w-80 h-10 rounded-lg`,
                    { backgroundColor: isFollowed ? "#ff0000" : "#6abdff" },
                  ]}
                  onPress={handleFollow}
                >
                  <Text style={tw`text-center font-bold text-white pt-3`}>
                    {isFollowed ? "Following" : "Follow"}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
            <View style={tw`flex-row justify-between items-center px-6`}>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{followers}</Text>
                <Text style={[tw`text-xs`, { color: "#6abdff" }]}>
                  Followers
                </Text>
              </View>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{following}</Text>
                <Text style={[tw`text-xs`, { color: "#6abdff" }]}>
                  Following
                </Text>
              </View>
              <View style={tw`text-center items-center`}>
                <Text style={tw`text-white font-bold`}>{ranked}</Text>
                <Text style={[tw`text-xs`, { color: "#6abdff" }]}>Ranked</Text>
              </View>
            </View>
          </View>
          <View
            style={{ borderBottomWidth: 2, borderBottomColor: "#ff0000" }}
          ></View>
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

export default UserPage;
