import { getBooksFromCategory } from "./googleImplementation";
import { calculateMedianAndSplitArray } from "../utils/utils";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  limit,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig.js";

export const categoryRank = async (uid, category) => {
  let categoryList = await getBooksFromCategory(category, uid);
  const { comparison, lessThanOrEqualList, greaterThanList } =
    calculateMedianAndSplitArray(categoryList);
  return { comparison, lessThanOrEqualList, greaterThanList };
};

export const updateBoundaryScores = async (
  review,
  score,
  uid,
  limitBoundary
) => {
  const booklistCollectionRef = collection(
    FIRESTORE_DB,
    "booklist",
    uid,
    review
  );
  const queryRef = query(booklistCollectionRef, where("score", "==", score));
  const querySnapshot = await getDocs(queryRef);
  try {
    const querySnapshot = await getDocs(queryRef);

    if (!querySnapshot <= 1) {
      const batch = [];

      querySnapshot.forEach((doc) => {
        const bookRef = doc.ref;
        const currentScore = doc.data().score;
        const newScore = currentScore + limitBoundary;

        // Update the document with the new score value
        const updateData = { score: newScore };
        batch.push(updateDoc(bookRef, updateData));
      });

      // Commit the batch updates
      await Promise.all(batch);

      console.log("Scores updated successfully.");
    } else {
      console.log("No books with the specified score found.");
    }
  } catch (error) {
    console.error("Error updating scores:", error);
  }
};
