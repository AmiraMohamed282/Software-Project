import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config';

/**
 * Add a product to a user's favorites
 * @param {string} userId - The user's ID
 * @param {string} productId - The product ID to add to favorites
 * @returns {Promise<boolean>} - Success status
 */
export const addToFavorites = async (userId, productId) => {
  if (!userId || !productId) {
    console.error('Error adding to favorites: userId and productId are required');
    return false;
  }

  try {
    const favoritesRef = doc(db, 'Favorites', userId);
    const docSnap = await getDoc(favoritesRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(favoritesRef, {
        products: arrayUnion(productId),
      });
      console.log(`Product ${productId} added to favorites.`);
    } else {
      // Create new document
      await setDoc(favoritesRef, { products: [productId] });
      console.log(`Favorites document created and product ${productId} added.`);
    }
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Remove a product from a user's favorites
 * @param {string} userId - The user's ID
 * @param {string} productId - The product ID to remove from favorites
 * @returns {Promise<boolean>} - Success status
 */
export const removeFromFavorites = async (userId, productId) => {
  if (!userId || !productId) {
    console.error('Error removing from favorites: userId and productId are required');
    return false;
  }

  try {
    const favoritesRef = doc(db, 'Favorites', userId);
    const docSnap = await getDoc(favoritesRef);
    
    if (!docSnap.exists()) {
      console.log(`No favorites document found for user ${userId}`);
      return false;
    }
    
    await updateDoc(favoritesRef, {
      products: arrayRemove(productId),
    });
    console.log(`Product ${productId} removed from favorites.`);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Get all favorite products for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array<string>>} - Array of product IDs
 */
export const getFavorites = async (userId) => {
  if (!userId) {
    console.error('Error fetching favorites: userId is required');
    return [];
  }

  try {
    const favoritesRef = doc(db, 'Favorites', userId);
    const docSnap = await getDoc(favoritesRef);
    
    if (docSnap.exists()) {
      return docSnap.data().products || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};