import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const TabContent = ({ booklist, movielist, tvlist, gamelist, musiclist }) => {
  const [activeTab, setActiveTab] = useState('Books');

  const renderList = (list) => {
    if (list && list.length > 0) {

      const sortedList = [...list].sort((a, b) => b.score - a.score);
  
      return (
        <View style={{ width: '100%' }}>
          {sortedList.map((item, index) => (
            <View key={index} style={[tw`flex-row items-center justify-between py-8 border-b border-gray-900`, { width: '100%' }]}>
              <Text 
                style={[tw`text-white font-bold text-xs ml-4 flex-shrink`, { maxWidth: '80%' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {index + 1}. {item.name || Object.keys(item).find(key => key !== 'score' && key !== 'date')}
              </Text>
              <View style={[tw`w-10 h-10 border-2 rounded-full justify-center items-center mr-4`, { borderColor: '#6abdff' }]}>
                <Text style={tw`text-white font-semibold`}>{item.score}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      return <Text style={tw`pt-20 text-white text-center font-bold text-xl`}>Nothing's in this list yet!</Text>;
    }
  };
  
  
  

  return (
    <View style={[tw`flex-1`, { width: '100%' }]}>
      <View style={[tw`rounded-b-lg overflow-hidden w-full`, { backgroundColor: '#2e2e2e' }]}>
        <View style={tw`flex-row justify-around m-2`}>
          <Pressable 
            style={[tw`flex-1 p-2 rounded justify-center`, { backgroundColor: activeTab === 'Books' ? '#ff0000' : 'transparent' }]} 
            onPress={() => setActiveTab('Books')}
          >
            <Text style={tw`text-white font-bold text-center`}>Books</Text>
          </Pressable>

          <Pressable 
            style={[tw`flex-1 p-2 rounded justify-center`, { backgroundColor: activeTab === 'Movies' ? '#ff0000' : 'transparent' }]} 
            onPress={() => setActiveTab('Movies')}
          >
            <Text style={tw`text-white font-bold text-center`}>Movies</Text>
          </Pressable>

          <Pressable 
            style={[tw`flex-1 p-2 rounded justify-center`, { backgroundColor: activeTab === 'TV' ? '#ff0000' : 'transparent' }]} 
            onPress={() => setActiveTab('TV')}
          >
            <Text style={tw`text-white font-bold text-center`}>TV</Text>
          </Pressable>

          <Pressable 
            style={[tw`flex-1 p-2 rounded justify-center`, { backgroundColor: activeTab === 'Games' ? '#ff0000' : 'transparent' }]} 
            onPress={() => setActiveTab('Games')}
          >
            <Text style={tw`text-white font-bold text-center`}>Games</Text>
          </Pressable>

          <Pressable 
            style={[tw`flex-1 p-2 rounded justify-center`, { backgroundColor: activeTab === 'Music' ? '#ff0000' : 'transparent' }]} 
            onPress={() => setActiveTab('Music')}
          >
            <Text style={tw`text-white font-bold text-center`}>Music</Text>
          </Pressable>
        </View>
      </View>
  
      <View style={tw`w-full`}>
        {activeTab === 'Books' && renderList(booklist)}
        {activeTab === 'Movies' && renderList(movielist)}
        {activeTab === 'TV' && renderList(tvlist)}
        {activeTab === 'Games' && renderList(gamelist)}
        {activeTab === 'Music' && renderList(musiclist)}
      </View>
    </View>
  );  
};

export default TabContent;
