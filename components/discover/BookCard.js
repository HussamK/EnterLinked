import React, { useState, useContext } from 'react';
import { View, Text, Image, Pressable, Modal, ScrollView} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import styles from '../../styles/globals.js';
import { AntDesign } from '@expo/vector-icons'; 
import { useUser } from '../../context/UserContext.js'; 
import { addBookToUser } from '../../api/userRelations.js';
import { truncateDescription } from '../../utils/utils.js';
import { EXCELLENT, OKAY, BAD, HATE } from '../../utils/consts.js';
import { categoryRank } from '../../api/rankFunctionality.js';
import { calculateMedianAndSplitArray } from '../../utils/utils.js';

const BookCard = ({ book }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { userModel } = useUser(); // Get userModel from context
    const [currentStep, setCurrentStep] = useState(1);
    const [score, setScore] = useState();
    const [review, setReview] = useState('');
    const [comparison, setComparison] = useState(null);
    const [lessThanOrEqualList, setlessThanOrEqualList] = useState([]);
    const [greaterThanList, setgreaterThanList] = useState([]);
    const [upperBoundary, setUpperBoundary] = useState();
    const [lowerBoundary, setLowerBoundary] = useState();

    const handleAddToList = async () => {
      setCurrentStep(2);
    };

    const submitToList = async (endScore) => {
        // if (score == topEntry) {
        //     await updateBoundaryScores(review, score, userModel.uid, -0.1);
        // } else if (score == lastEntry.score) {
        //     await updateBoundaryScores(review, score, userModel.uid, 0.1);
        // }
        let roundedScore = Math.round(endScore * 10)/ 10;
        await addBookToUser(userModel, book.volumeInfo.title, roundedScore, review, book.volumeInfo.imageLinks.thumbnail);
        setCurrentStep(4);
    }

    const closeModal = () => {
        setModalVisible(!modalVisible);
        setCurrentStep(1);
        setScore();
    }

    const handleRatingPress = async (upperBoundary, review, lowerBoundary) => {
        setUpperBoundary(upperBoundary);
        setLowerBoundary(lowerBoundary);
        let results = await categoryRank(userModel.uid, review)
        let comparison = results.comparison;
        setComparison(comparison);
        let lessThanOrEqualList = results.lessThanOrEqualList;
        let greaterThanList = results.greaterThanList;
        setReview(review);
        if (comparison != undefined) {
            setlessThanOrEqualList(lessThanOrEqualList);
            setgreaterThanList(greaterThanList);
            setCurrentStep(3);
        } else if (comparison == undefined) {
            endScore = (upperBoundary + lowerBoundary)/2;
            setScore((upperBoundary + lowerBoundary)/2);
            submitToList(endScore);
        }
    }

    const handleNewBetterReview = async (greaterList, comp) => {
        let lowerBoundary = comp.score;
        setLowerBoundary(lowerBoundary);
        let results = calculateMedianAndSplitArray(greaterList);
        let comparison = results.comparison;
        let lessThanOrEqualList = results.lessThanOrEqualList;
        let greaterThanList = results.greaterThanList;
        if (comparison != undefined) {
            setComparison(comparison);
            setlessThanOrEqualList(lessThanOrEqualList);
            setgreaterThanList(greaterThanList);
        } else {
            endScore = (upperBoundary + lowerBoundary)/2;
            setScore((upperBoundary + lowerBoundary)/2);
            submitToList(endScore);
        }
    }

    const handleOldBetterReview = (lesserList, comp) => {
        let upperBoundary = comp.score;
        setUpperBoundary(upperBoundary);
        let results = calculateMedianAndSplitArray(lesserList);
        let comparison = results.comparison;
        let lessThanOrEqualList = results.lessThanOrEqualList;
        let greaterThanList = results.greaterThanList;
        if (comparison != undefined) {
            setComparison(comparison);
            setlessThanOrEqualList(lessThanOrEqualList);
            setgreaterThanList(greaterThanList);
        } else {
            endScore = (upperBoundary + lowerBoundary)/2;
            setScore((upperBoundary + lowerBoundary)/2);
            submitToList(endScore);
        }
    }

    const views = [
        (
            <ScrollView key={1}>
                <Image
                    style={styles.modalCover}
                    source={{
                        uri: book.volumeInfo.imageLinks 
                            ? book.volumeInfo.imageLinks.thumbnail 
                            : 'http://example.com/default-thumbnail.jpg' // add a default thumbnail URL
                    }}
                />
                <Text style={styles.modalTitle}>{book.volumeInfo.title}</Text>
                <Text style={styles.modalText}>Author(s): {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</Text>
                <Pressable onPress={() => handleAddToList()}>
                    <View style={[tw`max-h-20 rounded-lg flex justify-center items-center p-2 shadow-sm`, {backgroundColor: '#ff0000'}]}>
                        <AntDesign name="pluscircleo" size={18} color="white" />
                    </View>
                </Pressable>
                <Text style={styles.modalDescription}>Description: {book.volumeInfo.description ? book.volumeInfo.description : 'No description available!'}</Text>
            </ScrollView>
        ), (
            <View key={2} contentContainerStyle={tw`flex-1 justify-center`} style={tw`p-4`}>
                <Text style={styles.secondModalTitle}>How was it?</Text>
                <View style={tw`flex-row justify-between mt-4`}>
                    <Pressable 
                        style={[tw`w-16 h-16 p-1 rounded-full items-center justify-center m-2`, {backgroundColor: 'rgba(168, 211, 226, 1)', borderColor: '#0084b5'}]}
                        onPress={() => handleRatingPress(10, EXCELLENT, 8)}
                    >
                        <Text style={tw`text-white text-xs font-semibold text-center`}>Amazing!</Text>
                    </Pressable>

                    <Pressable 
                        style={[tw`w-16 h-16 p-2 rounded-full items-center justify-center m-2`, {backgroundColor: 'rgba(153, 233, 155, 1)', color: '#00b51a'}]}
                        onPress={() => handleRatingPress(7, OKAY, 5.1)}
                    >
                        <Text style={tw`text-white text-xs font-semibold text-center`}>Good!</Text>
                    </Pressable>

                    <Pressable 
                        style={[tw`w-16 h-16 p-2 rounded-full items-center justify-center m-2`, {backgroundColor: 'rgba(231, 228, 47, 1)', borderColor: '#e7e127'}]}
                        onPress={() => handleRatingPress(5, BAD, 2.6)}
                    >
                        <Text style={tw`text-white text-xs font-semibold text-center`}>Bad!</Text>
                    </Pressable>

                    <Pressable 
                        style={[tw`w-16 h-16 p-2 rounded-full items-center justify-center m-2`, {backgroundColor: 'rgba(234, 120, 120, 1)', borderColor: '#b00000'}]}
                        onPress={() => handleRatingPress(2.5, HATE, 0)}    
                    >
                        <Text style={tw`text-white text-xs font-semibold text-center`}>Hated it!</Text>
                    </Pressable>
                </View>
            </View>
        ), (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={styles.secondModalTitle}> Which one was better? </Text>
                
                <View style={tw`flex-row justify-center items-center mt-4`}>
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Pressable
                            style={[tw`p-4 rounded-lg items-center justify-center my-2 w-40 h-40`]} 
                            onPress={() => handleNewBetterReview(greaterThanList, comparison)}
                        >   
                            <Image
                                style={styles.modalCover}
                                source={{
                                    uri: book.volumeInfo.imageLinks 
                                        ? book.volumeInfo.imageLinks.thumbnail 
                                        : 'http://example.com/default-thumbnail.jpg'
                                }}
                            />
                        </Pressable>
                        <View style={{ height: 30 }}>
                            <Text 
                                style={tw`text-white font-semibold mb-2 text-center`}
                                numberOfLines={1} 
                                ellipsizeMode='tail'> 
                                    {book.volumeInfo.title}
                            </Text>
                        </View>
                        <Text style={tw`text-white font-semibold text-center`}>{score}</Text>
                    </View>

                    <View style={tw` items-center mx-4`}>
                        <View style={[tw`flex-1 w-px`, {backgroundColor: '#6abdff'}]}></View>
                        <Text style={[tw`mb-4 mt-4 text-white font-semibold`, {color: '#6abdff'}]}>or</Text>
                        <View style={[tw`flex-1 w-px`, {backgroundColor: '#6abdff'}]}></View>
                    </View>

                    <View style={tw`flex-1 justify-center items-center`}>
                        <Pressable
                            style={[tw`p-4 rounded-lg items-center justify-center my-2 w-40 h-40`]} 
                            onPress={() => handleOldBetterReview(lessThanOrEqualList, comparison)}
                        >   
                            <Image
                                style={styles.modalCover}
                                source={{
                                    uri: comparison?.cover 
                                        ? comparison.cover 
                                        : 'http://example.com/default-thumbnail.jpg'
                                }}
                            />
                        </Pressable>
                        <View style={{ height: 30 }}> 
                            <Text 
                                style={tw`text-white font-semibold mb-2 text-center`}
                                numberOfLines={1} 
                                ellipsizeMode='tail'> 
                                    {comparison ? `${comparison.name}` : 'N/A'}
                            </Text>
                        </View>
                        <Text style={[tw`text-white font-semibold text-center`, {color: '#6abdff'}]}>
                            {comparison?.score}
                        </Text>
                    </View>
                </View>
            </View>
        ), (
            <ScrollView>
                <Text style={styles.modalTitle}>Done!</Text>
                    <Text style={tw`text-white`}> Thank you for your review! </Text>
            </ScrollView>
        )
    ]
  
    return (
        <View style={tw`px-4 shadow-md`}>
            <Pressable onPress={() => setModalVisible(true)}>
                <View style={styles.cardContainer}>
                    <Image
                    style={styles.bookCover}
                    source={{
                        uri: book.volumeInfo.imageLinks 
                            ? book.volumeInfo.imageLinks.thumbnail 
                            : 'http://example.com/default-thumbnail.jpg' // add a default thumbnail URL
                    }}
                    />
            
                    <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle}> {book.volumeInfo.title} </Text>
                        <Text style={styles.bookAuthor}>Author(s): {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</Text>
                        <Text style={styles.bookDescription}>
                            {truncateDescription(book.volumeInfo.description, 10)}
                        </Text>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                    <View style={
                        currentStep === 2 
                        ? styles.smallModalView 
                        : currentStep === 3 
                        ? styles.thirdStepModalView 
                        : styles.modalView
                    }>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={closeModal}
                            >
                                <Text style={styles.textStyle}>X</Text>
                            </Pressable>
                            {views[currentStep - 1]}
                        </View>
                    </View>
                </Modal>
            </Pressable>
        </View>
    );
  };
  
  export default BookCard;
