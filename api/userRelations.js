import { doc, setDoc, getDoc, getDocs, query, collection, arrayUnion, arrayRemove, writeBatch, runTransaction, orderBy, limit, startAfter, where, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig.js';

export async function followUser(followerUid, followingUid) {
  // Reference to the document storing followers of followingUid
  const followerDocRef = doc(FIRESTORE_DB, 'followers', followingUid); 

  // Reference to the document storing people that followerUid is following
  const followingDocRef = doc(FIRESTORE_DB, 'following', followerUid); 

  try {
    // Add followerUid to the followers of followingUid
    await setDoc(followerDocRef, { 
      followers: arrayUnion(followerUid) 
    }, { merge: true });

    // Add followingUid to the people that followerUid is following
    await setDoc(followingDocRef, { 
      following: arrayUnion(followingUid) 
    }, { merge: true });

    console.log('Follow relationship added successfully');
  } catch (error) {
    console.error('Error adding follow relationship:', error);
    throw error;
  }
}

export async function unfollowUser(followerUid, followingUid) {
  // Reference to the document storing followers of followingUid
  const followerDocRef = doc(FIRESTORE_DB, 'followers', followingUid); 

  // Reference to the document storing people that followerUid is following
  const followingDocRef = doc(FIRESTORE_DB, 'following', followerUid); 

  try {
    // Remove followerUid from the followers of followingUid
    await setDoc(followerDocRef, { 
      followers: arrayRemove(followerUid) 
    }, { merge: true });

    // Remove followingUid from the people that followerUid is following
    await setDoc(followingDocRef, { 
      following: arrayRemove(followingUid) 
    }, { merge: true });

    console.log('User unfollowed successfully');
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

export async function getFollowersCount(userId) {
  const followersCollectionRef = collection(FIRESTORE_DB, 'followers');
  const followersDocRef = doc(followersCollectionRef, userId);

  try {
    const followersDocSnapshot = await getDoc(followersDocRef);

    if (followersDocSnapshot.exists()) {
      const followersData = followersDocSnapshot.data();
      const followersCount = followersData.followers.length;
      return followersCount;
    } else {
      console.log('followers document does not exist for the user');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching followers count:', error);
    return 0;
  }
}


export async function getFollowingCount(userId) {
    const followingCollectionRef = collection(FIRESTORE_DB, 'following');
    const followingDocRef = doc(followingCollectionRef, userId);

    try {
      const followingDocSnapshot = await getDoc(followingDocRef);
  
      if (followingDocSnapshot.exists()) {
        const followingData = followingDocSnapshot.data();
        const followingCount = followingData.following.length;
        return followingCount;
      } else {
        console.log('Following document does not exist for the user');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching following count:', error);
      return 0;
    }
  }

export async function getFollowingList(userId) {

  const userDocRef = doc(FIRESTORE_DB, 'following', userId); 

  try {
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const followingList = userData.following || [];
      return followingList;
    } else {
      console.log('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching following list:', error);
    return [];
  }
}

export async function getFollowersList(uid) {
  try {
    const followersRef = doc(FIRESTORE_DB, 'followers', uid);
    const followersSnapshot = await getDoc(followersRef);

    if (followersSnapshot.exists()) {
      return followersSnapshot.data().followers;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error fetching followers list: ${error.message}`);
    return [];
  }
}




export async function isUserFollowed(followerUid, followingUid) {
  // Reference to the document storing people that followerUid is following
  const followingDocRef = doc(FIRESTORE_DB, 'following', followerUid); 

  try {
    const followingDocSnapshot = await getDoc(followingDocRef);

    if (followingDocSnapshot.exists()) {
      const followingData = followingDocSnapshot.data();
      const isFollowed = followingData.following.includes(followingUid);
      return isFollowed;
    } else {
      console.log('Following document does not exist for the user');
      return false;
    }
  } catch (error) {
    console.error('Error checking if user is followed:', error);
    throw error;
  }
}

export async function addUserPostsToFeedInChunks(followerId, followedUserId, numberOfPosts = 50) {
  const userPostsRef = collection(FIRESTORE_DB, 'userPosts');

  let lastDoc;
  
  while (numberOfPosts > 0) {
      let baseQuery = query(
          userPostsRef,
          where('uid', '==', followedUserId),
          orderBy('date', 'desc')
      );

      if (lastDoc) {
          baseQuery = query(baseQuery, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(baseQuery);

      if (!querySnapshot.size) {
          break;  // No more posts to fetch
      }
      
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const batch = writeBatch(FIRESTORE_DB);

      for (let document of querySnapshot.docs) {
          const feedRef = doc(FIRESTORE_DB, 'feeds', followerId, 'userFeed', document.id);
          batch.set(feedRef, { postID: document.id, date: document.data().date, uid: followedUserId });
      }

      await batch.commit();
      numberOfPosts -= querySnapshot.size;
  }
}

export async function removeUserPostsFromFeedInChunks(followerId, unfollowedUserId) {
  const feedRef = collection(FIRESTORE_DB, 'feeds', followerId, 'userFeed');
  let lastDoc;

  while (true) {
      let baseQuery = query(
          feedRef,
          where('uid', '==', unfollowedUserId),
          orderBy('date', 'desc'),
          limit(500)
      );

      if (lastDoc) {
          baseQuery = query(baseQuery, startAfter(lastDoc));
      }
      
      try {
          const querySnapshot = await getDocs(baseQuery);

          if (!querySnapshot.size) {
              break;  // No more posts to remove
          }

          lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          const batch = writeBatch(FIRESTORE_DB);

          for (let document of querySnapshot.docs) {
              const postRef = doc(FIRESTORE_DB, 'feeds', followerId, 'userFeed', document.id);
              batch.delete(postRef);
          }

          await batch.commit();
      } catch(error) {
          console.error("Error in removeUserPostsFromFeedInChunks:", error);
          break; // Break the loop to prevent infinite loops in case of errors
      }
  }
}


export async function fetchFeed(userId, lastVisible, pageSize) {
  let feed = [];
  
  // Reference to user's feed
  let feedRef;
  if (lastVisible) {
    feedRef = query(
      collection(FIRESTORE_DB, `feeds/${userId}/userFeed`),
      orderBy('date', 'desc'),
      startAfter(lastVisible.date),
      limit(pageSize)
    );
  } else {
    feedRef = query(
      collection(FIRESTORE_DB, `feeds/${userId}/userFeed`),
      orderBy('date', 'desc'),
      limit(pageSize)
    );
  }

  // Fetch the userFeed entries (postIDs)
  const feedSnapshot = await getDocs(feedRef);

  if (feedSnapshot.empty) {
    return { feed: [], lastVisible: null }; // Return empty feed and null for lastVisible
  }


  const feedPostIds = feedSnapshot.docs.map(doc => doc.id);

  // Fetch actual post data in chunks of 10 using the 'in' operator
  const userPostsCollectionRef = collection(FIRESTORE_DB, 'userPosts');
  let unorderedFeed = [];
  
  for (let i = 0; i < feedPostIds.length; i += 10) {
    const chunkOfPostIds = feedPostIds.slice(i, i + 10);
    const chunkQuery = query(userPostsCollectionRef, where('postID', 'in', chunkOfPostIds));
    const chunkSnapshot = await getDocs(chunkQuery);
    unorderedFeed = unorderedFeed.concat(chunkSnapshot.docs.map(doc => doc.data()));
  }
  
  // Sort the results based on the order in feedPostIds
  feed = unorderedFeed.sort((a, b) => {
    return feedPostIds.indexOf(a.postID) - feedPostIds.indexOf(b.postID);
  });

  // Get the last visible post for pagination
  const lastVisiblePost = feed[feed.length - 1];

  return { feed, lastVisible: lastVisiblePost };
};


async function fanOutPostToFollowers(postID, followersList, uid) {
  const batch = writeBatch(FIRESTORE_DB);
  
  followersList.forEach(followerUID => {
    const followerFeedRef = doc(collection(FIRESTORE_DB, "feeds", followerUID, "userFeed"), postID);
    batch.set(followerFeedRef, {
      postID,
      date: serverTimestamp(),
      uid: uid
    });
  });

  await batch.commit();
}

export async function addBookToUser(userModel, bookTitle, score, category, bookCover) {
  try {
    if (!userModel) {
      console.log("User model is not available.");
      return;
    }

    const newBook = {
      name: bookTitle,
      score: score,
      cover: bookCover,
    };

    const uid = userModel.uid;

    // Create an empty document reference with an auto-generated ID
    const userPostsRef = collection(FIRESTORE_DB, 'userPosts');
    const newPostRef = doc(userPostsRef);
    const postID = newPostRef.id; // Extract auto-generated ID

    const newPost = {
      uid: userModel.uid,
      userName: userModel.name,
      profilePicture: userModel.profilePicture,
      itemName: bookTitle,
      score: score,
      date: serverTimestamp(),
      postID: postID, // Include the postID
    };

    // Use Firestore Transaction
    await runTransaction(FIRESTORE_DB, async (transaction) => {
      // Create book reference
      const bookListRef = doc(FIRESTORE_DB, 'booklist', uid, category, bookTitle);

      // Check if book already exists in the user's booklist
      const bookSnapshot = await transaction.get(bookListRef);
      if (bookSnapshot.exists()) {
        console.log(`Book "${bookTitle}" already exists in the list.`);
        return;
      }

      transaction.set(bookListRef, newBook);
      transaction.set(newPostRef, newPost);
    });

    const followersList = await getFollowersList(uid)
    await fanOutPostToFollowers(postID, followersList, uid)

    console.log(`Book "${bookTitle}" added to list and post created successfully.`);
  } catch (error) {
    console.error(`Error while adding book or creating post: ${error.message}`);
  }
}