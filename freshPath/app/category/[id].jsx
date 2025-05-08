import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams(); // الـ ID من الرابط
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCategoryById(id);
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
      console.error("Error getting document:", error);
    } finally {
      setLoading(false);
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
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.image}
        />
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
});
