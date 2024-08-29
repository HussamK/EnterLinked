export const truncateDescription = (description, wordLimit) => {
    if (!description) return '';
    let words = description.split(' ');
    if (words.length > wordLimit) {
        words = words.slice(0, wordLimit);
        return words.join(' ') + '...';
    }
    return description;
};

export function calculateMedian(sortedList) {
    const length = sortedList.length;
    
    if (length === 0) {
      return undefined; // Handle empty list if needed
    }
  
    if (length % 2 === 1) {
      // Odd number of elements
      const middleIndex = Math.floor(length / 2);
      return sortedList[middleIndex];
    } else {
      // Even number of elements
      const middleIndex1 = length / 2 - 1;
      const middleIndex2 = length / 2;
      const value1 = sortedList[middleIndex1];
      const value2 = sortedList[middleIndex2];
      return (value1 + value2) / 2;
    }
  }

export function calculateMedianAndSplitArray(arr) {
    // Ensure arr is not empty
    if (arr.length === 0) {
        return {
        comparison: undefined,
        lessThanOrEqualList: [],
        greaterThanList: [],
        };
    }

    // Sort the array by the "score" property
    arr.sort((a, b) => a.score - b.score);

    const length = arr.length;
    const middleIndex = Math.floor(length / 2);

    const comparison = arr[middleIndex];

    const lessThanOrEqualList = arr.slice(0, middleIndex);
    const greaterThanList = arr.slice(middleIndex + 1);

    return {
        comparison,
        lessThanOrEqualList,
        greaterThanList,
    };
}