import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, TextInput, Pressable } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import styles from '../../styles/globals.js';
import { fetchBooks, fetchMovies, fetchGames, fetchTV, fetchMusic, fetchUsers } from '../../api/googleImplementation.js';
import BookCard from './BookCard.js';
import MovieCard from './MovieCard.js';
import GameCard from './GameCard.js';
import MusicCard from './MusicCard.js';
import TvCard from './TvCard.js';
import UserCard from './UserCard.js';

const SearchBar = () => {
    const [text, onChangeText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeTab, setActiveTab] = useState('Discover');
    const [subCategory, setSubCategory] = useState('');

    const opacity = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [searchResults]);

    const fetchResults = async () => {
        if (!text.trim()) return;

        let fetchFunction;
        switch (subCategory) {
            case 'Movies': fetchFunction = fetchMovies; break;
            case 'Games': fetchFunction = fetchGames; break;
            case 'TV': fetchFunction = fetchTV; break;
            case 'Music': fetchFunction = fetchMusic; break;
            case 'Books': fetchFunction = fetchBooks; break;
            case 'Users': fetchFunction = fetchUsers; break;
        }

        try {
            const response = await fetchFunction(text);
            opacity.setValue(0);
            setSearchResults(response);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const getEmptyMessage = () => {
        if (activeTab === 'People') return 'Try searching for a friend';
        if (activeTab === 'Discover' && ['Books'].includes(subCategory)) return 'Try searching for a book';
        if (activeTab === 'Discover' && ['Movies', 'TV', 'Games', 'Music'].includes(subCategory)) return 'Coming Soon';
        return 'Select a category';
    }

    const searchBarY = scrollY.interpolate({
        inputRange: [0, 180],
        outputRange: [0, -215],
        extrapolate: 'clamp',
    });

    const setActiveTabPeople = () => {
        setActiveTab('People');
        setSubCategory('Users');
        setSearchResults([]);
    }

    const setActiveTabDiscover = () => {
        setActiveTab('Discover');
        setSubCategory('Books');
        setSearchResults([]);
    }

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={[
                styles.searchContainer,
                { transform: [{ translateY: searchBarY }] },
                { position: 'absolute', zIndex: 1, width: '100%', marginTop: 80 }
            ]}>
                <View style={tw`flex-row justify-center mb-3 w-full`}>
                <Pressable 
                    onPress={() => setActiveTabDiscover()} 
                    style={[
                        tw`${activeTab === 'Discover' ? 'rounded-l-lg' : 'border-l-2 border-b-2 border-t-2 rounded-l-lg border-red-600'} w-1/2 py-2`,
                        activeTab === 'Discover' ? { backgroundColor: '#ff0000' } : {}
                    ]}
                >
                    <Text style={tw`text-white font-bold text-center`}>Discover</Text>
                </Pressable>

                <Pressable 
                    onPress={() => setActiveTabPeople()} 
                    style={[
                        tw`${activeTab === 'People' ? 'rounded-r-lg' : 'border-r-2 border-b-2 border-t-2 rounded-r-lg border-red-600'} w-1/2 py-2`,
                        activeTab === 'People' ? { backgroundColor: '#ff0000' } : {}
                    ]}
                >
                    <Text style={tw`text-white font-bold text-center`}>People</Text>
                </Pressable>
                </View>
                <View style={tw`flex-row justify-between items-center`}>
                    <View style={styles.searchWrapper}>
                        <TextInput
                            style={tw`w-full px-3 py-1 text-white font-semibold`}
                            value={text}
                            onChangeText={onChangeText}
                            placeholder="What are you looking for?"
                            placeholderTextColor="#b0b0b0"
                            onSubmitEditing={fetchResults}
                        />
                    </View>
                    <View style={tw`pr-2`}>
                    <Pressable
                        style={[
                            tw`w-20 h-9 rounded-lg`,
                            { backgroundColor: '#ff0000' }
                        ]}
                        onPress={fetchResults}
                    >
                        <Text style={tw`text-center font-bold text-white py-2`}>Search</Text>
                    </Pressable>
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={{ opacity }}>
                <Animated.ScrollView
                    contentContainerStyle={{ paddingTop: 208, paddingBottom: 100 }}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'Discover' && (
                        <View style={[tw`flex-row justify-around mb-3 rounded-lg mx-2 p-2 mt-4`, {backgroundColor: '#2e2e2e'}]}>
                            {['Books', 'Movies', 'TV', 'Games', 'Music'].map(category => (
                                <Pressable
                                    key={category}
                                    onPress={() => setSubCategory(category)}
                                    style={[
                                        tw`flex-1 rounded-lg py-2 justify-center`,
                                        subCategory === category ? { backgroundColor: '#ff0000' } : {}
                                    ]}
                                >
                                    <Text style={tw`text-white font-bold text-center`}>{category}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                    {searchResults.length === 0
                        ? <Text style={styles.noResults}>{getEmptyMessage()}!</Text>
                        : searchResults.map((item) => {
                            // if (activeTab === 'People') return <UserCard key={item.id} user={item} />;
                            switch (subCategory) {
                                case 'Movies':
                                    return <MovieCard key={item.id} movie={item} />;
                                case 'Games':
                                    return <GameCard key={item.id} game={item} />;
                                case 'TV':
                                    return <TvCard key={item.id} tv={item} />;
                                case 'Music':
                                    return <MusicCard key={item.id} music={item} />;
                                case 'Books':
                                    return <BookCard key={item.id} book={item} />;
                                case 'Users':
                                    return <UserCard key={item.uid} user={item} />;
                            }
                        })
                    }
                </Animated.ScrollView>
            </Animated.View>
        </View>
    );
}

export default SearchBar;
