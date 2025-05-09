import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (id) {
      getCategoryById(id);
      getProductsByCategory(id);
    }
  }, [id]);

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
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
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
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{category.name}</Text>
        <Text style={{ marginTop: 8, color: '#444' }}>
          {category.description || "No description available."}
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Products:</Text>
        {products.length === 0 ? (
          <Text style={{ color: '#666', marginTop: 10 }}>No products found in this category.</Text>
        ) : (
          products.map(product => (
            <View key={product.id} style={{ marginTop: 15 }}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>{product.name}</Text>
              <Text style={{ color: '#666' }}>{product.description}</Text>
            </View>
          ))
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
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});
