import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addToCart } from '../../firebase/apis/carts';
import { useAuth } from '../../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeFromCart } from '../../firebase/apis/carts';
import { addToFavorites, removeFromFavorites, getFavorites } from '../../firebase/apis/favorites';

const { width } = Dimensions.get('window');

export default function CategoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionLines, setDescriptionLines] = useState(3);
  const [numColumns, setNumColumns] = useState(width > 600 ? 2 : 1);
  const [favorites, setFavorites] = useState([]);

  const { loadUserFromStorage } = useAuth();
  const [user, setUser] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      try {
            const userData = await loadUserFromStorage();
            if (userData) {
                setUser(userData);
                const userFavorites = await getFavorites(userData.uid);
                setFavorites(userFavorites);
            } else {
                console.log('No user data found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching user data from AsyncStorage:', error);
        }
    };

    fetchUser();
    const updateColumns = () => {
      const { width } = Dimensions.get('window');
      setNumColumns(width > 600 ? 2 : 1);
    };

    Dimensions.addEventListener('change', updateColumns);
    return () => Dimensions.removeEventListener('change', updateColumns);
  }, []);

  useEffect(() => {
    if (id) {
      getCategoryById(id);
      getProductsByCategory(id);
    }
  }, [id]);

  useEffect(() => {
    const updateColumns = () => {
      const { width } = Dimensions.get('window');
      setNumColumns(width > 600 ? 2 : 1);
    };

    updateColumns(); // Ensure columns are set on initial render
    Dimensions.addEventListener('change', updateColumns);
    return () => Dimensions.removeEventListener('change', updateColumns);
  }, []);

  const getCategoryById = async (id) => {
    try {
      const docRef = doc(db, 'Category', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCategory(docSnap.data());
      } else {
        console.warn("No such document!");
      }
    } catch (error) {
      console.error("Error getting category:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      const q = query(
        collection(db, "Product"),
        where("categoryId", "==", categoryId)
      );
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched products:", productsData); // Debug log
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setDescriptionLines(showFullDescription ? 3 : 0);
  };

  const handleAddToCart = async (product) => {
    if (!product) {
      console.error("Product is undefined in handleAddToCart");
      return;
    }
  
    try {
      if (!user) {
        console.log('User not logged in');
        return;
      }
  
      console.log('Adding product to cart:', product);
      await addToCart(user.uid, product);
      console.log('Product added to cart:', product.name);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      if (!user) {
        console.log('User not logged in');
        return;
      }

      await removeFromCart(user.uid, productId);
      console.log('Product removed from cart:', productId);
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await removeFromFavorites(user.uid, productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToFavorites(user.uid, productId);
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderProductItem = ({ item }) => {
    if (!item) {
      console.error("Item is undefined in renderProductItem");
      return null;
    }

    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.productContainer}>
        <TouchableOpacity 
          style={styles.productItem}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Text>
              
              <Text style={styles.productPrice}>
                ${item.price?.toFixed(2) || '0.00'}
              </Text>
              
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <MaterialIcons name="add-shopping-cart" size={20} color="#4a90e2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleRemoveFromCart(item.id)}
                >
                  <MaterialIcons name="remove-shopping-cart" size={20} color="#ff4444" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleToggleFavorite(item.id)}
                >
                  <MaterialIcons 
                    name={isFavorite ? "favorite" : "favorite-border"} 
                    size={20} 
                    color={isFavorite ? "#ff4444" : "#666"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ marginTop: 100 }} />;
  }

  if (!category) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Category not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.imageUrl }} style={styles.image} />
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text 
          style={styles.categoryDescription} 
          numberOfLines={descriptionLines}
        >
          {category.description || "No description available."}
        </Text>
        {category.description && category.description.length > 100 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.readMore}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Products</Text>
        {products.length === 0 ? (
          <Text style={styles.noProducts}>No products found in this category.</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns === 2 ? styles.row : null}
            scrollEnabled={false}
            key={numColumns} // أضفنا المفتاح هنا علشان يرندر من جديد لما يتغير عدد الأعمدة
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topButtons: {
    position: 'absolute',
    top: 50,
    left: 16,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryDescription: {
    color: '#444',
    lineHeight: 22,
  },
  readMore: {
    color: '#4a90e2',
    marginTop: 5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noProducts: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  productContainer: {
    flex: 1,
    padding: 8,
  },
  productItem: {
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  actionButton: {
    padding: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
});