import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import styles from '../../../styles/globals';

const NameScreen = ({ navigation }) => {
    const [name, setName] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor: '#010312' }]}>
                <View style={[tw`rounded-xl p-8 h-1/2 w-4/5`, { backgroundColor: '#121001' }]}>
                    <View style={tw`flex-1 justify-center`}>
                        <Text style={[tw`text-center text-white text-2xl font-bold`]}>What's your name?</Text>
                    </View>
                    <View style={tw`flex-1 justify-center`}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            style={tw`w-60 p-4 text-left shadow-lg rounded-full bg-gray-100`}
                            placeholderTextColor="#b0b0b0"
                        />
                    </View>
                    <View style={[tw`flex-1 flex-row justify-between items-center`]}>
                        <TouchableOpacity
                            style={tw`bg-red-500 w-24 h-10 rounded-full`}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={tw`text-center text-white pt-3`}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-red-500 w-24 h-10 rounded-full`}
                            onPress={() => navigation.navigate('Bio', { name: name })}
                        >
                            <Text style={tw`text-center text-white pt-3`}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NameScreen;
