import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../../firebase/apis/carts';
import { getFavorites, removeFromFavorites } from '../../firebase/apis/favorites';
import { useAuth } from '../../firebase/auth';

export default function Favorite() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadUserFromStorage } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userData = await loadUserFromStorage();
        if (!userData) {
          console.log('No user data found in AsyncStorage');
          router.push('/Login');
          return;
        }

        setUser(userData);

        // Fetch favorite product IDs using the provided API function
        const userFavorites = await getFavorites(userData.uid);
        console.log('Favorite product IDs:', userFavorites);

        if (userFavorites.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Fetch product details for the favorite product IDs
        const chunkSize = 10; // Firestore 'in' query limit is 10
        const productChunks = [];
        for (let i = 0; i < userFavorites.length; i += chunkSize) {
          productChunks.push(userFavorites.slice(i, i + chunkSize));
        }

        const allProducts = [];
        for (const chunk of productChunks) {
          const q = query(collection(db, 'Product'), where('__name__', 'in', chunk));
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          allProducts.push(...products);
        }

        console.log('Fetched favorite products:', allProducts);
        setFavorites(allProducts);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleAddToCart = async (product) => {
    if (!product) {
      console.error('Product is undefined in handleAddToCart');
      return;
    }

    try {
      if (!user) {
        console.log('User not logged in');
        router.push('/login');
        return;
      }

      console.log('Adding product to cart:', product);
      await addToCart(user.uid, product);
      console.log('Product added to cart:', product.name);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      if (!user) return;

      console.log('Removing product from favorites:', productId);

      // Update the UI first for immediate feedback
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));

      // Then perform the Firebase operation using the provided API function
      await removeFromFavorites(user.uid, productId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        defaultSource={require('../../assets/placeholder.png')} // Add a default placeholder image
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price?.toFixed(2) || '0.00'}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFromFavorites(item.id)}
          >
            <Ionicons name="heart" size={24} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart" size={20} color="#4a90e2" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No favorite items yet</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0', // Placeholder color before image loads
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginVertical: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 5,
  },
  addToCartButton: {
    backgroundColor: '#e8f4ff',
    padding: 8,
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 25,
  },
  browseButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});