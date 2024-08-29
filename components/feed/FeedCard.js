import React, { useState, useEffect } from 'react';
import { Text, View, Animated, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

const FeedCard = ({ user, itemName, score }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={tw`p-4 my-2 border-t border-gray-900`}>
      {/* Container for Profile Picture, Main Content, and Score */}
      <View style={tw`flex-row items-center`}>
        
        {/* Profile Picture */}
        <View style={tw`mr-4`}>
          <Animated.Image
            source={{ uri: user.profilePicture }}
            style={[
              tw`w-14 h-14 border-2 bg-gray-900 rounded-full`,
              { borderColor: '#ff0000', opacity }
            ]}
          />
        </View>

        {/* Main Content */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-white`}>
            <Text style={tw`font-bold`}>{user.userName}</Text>
            <Text> reviewed </Text>
            <Text style={tw`font-bold`}>{itemName}</Text>
          </Text>
          <Text style={tw`text-xs text-gray-500 mt-1`}>Books</Text>
        </View>

        {/* Score */}
        <View style={[tw`w-10 h-10 border-2 rounded-full justify-center items-center ml-4 mr-3`, { borderColor: '#6abdff' }]}>
          <Text style={tw`text-white font-semibold`}>{score}</Text>
        </View>
      </View>

      {/* Like Icon, Comment Icon, and Input Field */}
      <View style={tw`flex-row items-center justify-between mt-6`}>
        
        {/* Input Field */}
        <TextInput
          style={[tw`flex-1 bg-gray-900 p-2 rounded-lg mr-2`, { color: 'white', fontWeight: '600' }]}
          placeholder="Add a comment..."
          placeholderTextColor="white"
        />

        {/* Comment Icon in Circular View */}
        <TouchableOpacity style={tw`w-10 h-10 bg-gray-900 rounded-full justify-center items-center mr-2`}>
          <FontAwesome name="comment-o" size={20} color="#6abdff" />
        </TouchableOpacity>

        {/* Like Icon */}
        <TouchableOpacity>
          <FontAwesome name="heart-o" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedCard;
