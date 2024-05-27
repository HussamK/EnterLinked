import axios from 'axios';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FIRESTORE_DB } from '../firebaseConfig';
import { API_KEY } from '@env'




export const fetchBooks = async (searchTerm) => {

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}`
    );

    const books = response.data.items;
    return books;
    // Process the fetched books as needed
  } catch (error) {
    console.error(error);
  }
};

export const fetchMovies = async (searchTerm) => {
  return []
}

export const fetchGames = async (searchTerm) => {
  return []
}

export const fetchTV = async (searchTerm) => {
  return []
}

export const fetchMusic = async (searchTerm) => {
  return []
}

export const fetchUsers = async (name) => {
  const usersCollectionRef = collection(FIRESTORE_DB, 'users');
  const q = query(usersCollectionRef, where('name', '>=', name));
  
  try {
    const querySnapshot = await getDocs(q);

    const matchingUsernames = querySnapshot.docs.map(doc => {
      const userData = doc.data();
      return userData;
    });

    return matchingUsernames;
  } catch (error) {
    console.error('Error searching usernames:', error);
    return [];
  }
}

const getBooksFromSubcollection = async (userDocRef, subCollectionName) => {
  const subColRef = collection(userDocRef, subCollectionName);
  const snapshot = await getDocs(subColRef);
  return snapshot.docs.map(doc => doc.data());
};

export const fetchAllBooks = async (uid) => {
  const userDocRef = doc(FIRESTORE_DB, 'booklist', uid);

  // Names of the sub-collections
  const subCollections = ['bad', 'excellent', 'hate', 'okay'];

  let allBooks = [];

  // Fetch books from each sub-collection and add them to `allBooks`
  for (const subCollectionName of subCollections) {
    const books = await getBooksFromSubcollection(userDocRef, subCollectionName);
    allBooks = [...allBooks, ...books];
  }

  return allBooks;
};

export const getBooksFromCategory = async (category, uid) => {
  const userDocRef = doc(FIRESTORE_DB, 'booklist', uid);
  const books = await getBooksFromSubcollection(userDocRef, category);
  return books;
}