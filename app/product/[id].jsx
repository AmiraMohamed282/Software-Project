import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getAuth } from "firebase/auth";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Product", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No such product!");
        }

        // Fetch reviews
        const reviewsSnapshot = await getDocs(
          collection(db, "Product", id, "reviews")
        );
        const reviewsData = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddReview = async () => {
    const text = newReview.trim();
    if (!text) {
      Alert.alert("Please write a review.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const review = {
        text,
        user: user ? user.email : "Anonymous",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "Product", id, "reviews"), review);
      setNewReview("");

      // Refresh reviews
      const reviewsSnapshot = await getDocs(
        collection(db, "Product", id, "reviews")
      );
      const reviewsData = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);

      Alert.alert("Review added!");
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("Failed to add review.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.productInfoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.categoryName}>{product.categoryName}</Text>
        </View>

        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating || "4.7"}</Text>
            <Text style={styles.freeText}>Free</Text>
            <Text style={styles.sizeText}>20 mb</Text>
          </View>
          <Text style={styles.price}>
            ${product.price?.toFixed(2) || "0.00"}
          </Text>
        </View>

        <Text style={styles.description}>
          {product.description || "No description available."}
        </Text>

        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Reviews
          </Text>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View
                key={review.id}
                style={{
                  marginBottom: 10,
                  backgroundColor: "#f0f0f0",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 14, fontStyle: "italic" }}>
                  "{review.text}"
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                  by {review.user}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 14, color: "#666" }}>No reviews yet.</Text>
          )}

          <TextInput
            placeholder="Write your review..."
            value={newReview}
            onChangeText={setNewReview}
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginTop: 15,
              fontSize: 14,
            }}
            multiline
          />

          <TouchableOpacity
            onPress={handleAddReview}
            style={{
              marginTop: 10,
              backgroundColor: "#4a90e2",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    color: "#4a90e2",
    marginTop: 10,
  },
  productImage: {
    width: "100%",
    height: 300,
  },
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  productInfoContainer: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  categoryName: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    marginRight: 15,
    color: "#333",
  },
  freeText: {
    marginRight: 15,
    color: "#4a90e2",
  },
  sizeText: {
    color: "#666",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  addToCartText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
