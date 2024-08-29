import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Image, RefreshControl } from 'react-native';
import FeedCard from './feed/FeedCard';
import { fetchFeed } from '../api/userRelations';
import { useUser } from '../context/UserContext';
import tw from 'tailwind-react-native-classnames';

const HomePage = () => {
  const { userModel } = useUser();

  const [feed, setFeed] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // This state tracks if there are more posts to load
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userModel) {
        const { feed: newFeed, lastVisible: newLastVisible } = await fetchFeed(userModel.uid, null, 10);
        setFeed(newFeed);
        setLastVisible(newLastVisible);
        if (newFeed.length === 0) {
          setHasMorePosts(false);
        }
      }
    };

    fetchData();
  }, [userModel]);

  const loadMorePosts = async () => {
    if (isLoading || !userModel || !hasMorePosts) return;

    setIsLoading(true);
    const { feed: newFeed, lastVisible: newLastVisible } = await fetchFeed(userModel.uid, lastVisible, 10);
    setFeed(prevFeed => [...prevFeed, ...newFeed]);
    setLastVisible(newLastVisible);
    setIsLoading(false);

    if (newFeed.length === 0) {
      setHasMorePosts(false); // If no new feed items were retrieved, set hasMorePosts to false
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const { feed: newFeed, lastVisible: newLastVisible } = await fetchFeed(userModel.uid, null, 10);
    setFeed(newFeed);
    setLastVisible(newLastVisible);
    if (newFeed.length === 0) {
      setHasMorePosts(false);
    }
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + layoutHeight >= contentHeight - 500 && !isLoading) {
      loadMorePosts();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[tw`flex-1`, { backgroundColor: '#010312', paddingBottom: 40, paddingTop: 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={{ paddingBottom: 160 }}>
          <Text style={tw`text-white font-semibold text-lg mx-4 my-2`}>Top Lists</Text>
          <ScrollView horizontal={true} style={tw`mb-4`} showsHorizontalScrollIndicator={false}>
            <View style={tw`flex-row`}>
              {[...Array(3)].map((_, index) => (
                <View key={index} style={tw`relative w-40 h-32 mx-2`}>
                  <Image
                    source={require('../assets/list_placeholder.jpg')}
                    style={tw`w-full h-full rounded-lg`}
                  />
                  <Text style={tw`absolute bottom-1 left-1 text-white font-semibold text-xl`}>Coming Soon!</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <Text style={tw`text-white font-semibold text-lg mx-4 my-2`}>Feed</Text>
          {feed.map((post, index) => (
            <FeedCard
              key={index}
              user={{ userName: post.userName, profilePicture: post.profilePicture, uid: post.uid }}
              itemName={post.itemName}
              score={post.score}
            />
          ))}
          {!hasMorePosts && (
            <>
              <Text style={tw`text-gray-600 text-xs font-semibold text-center p-4`}>End of your feed!</Text>
              <Text style={tw`text-gray-600 text-xs font-semibold text-center p-4`}>scroll back up to see what you're friends are up to :)</Text>
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default HomePage;
