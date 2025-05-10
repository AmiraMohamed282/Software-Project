import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartItems, removeItemById, increaseQuantity, decreaseQuantity, removeFromCart } from "../firebase/apis/carts";
import { useAuth } from '../firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState();
  const router = useRouter();
  const { loadUserFromStorage } = useAuth();

  // Fetch the current user and their cart items
  const fetchCurrentUser = async () => {
    try {
      const userData = await loadUserFromStorage();
      console.log ("User data fetched cart:", userData);
      if (!userData) {
        console.log("No user data found in AsyncStorage");
      }
      setUser(userData);

      if (userData.uid) {
        const data = await getCartItems(userData.uid);
        setCartItems(data);
        console.log("Cart items fetched:", data);
      }
    } catch (error) {
      console.error("Error fetching user or cart items:", error);
    }
  };

    useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Increase item quantity
  const increase = async (itemId) => {
    try {
      if (user?.uid) {
        await increaseQuantity(user.uid, itemId);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  // Decrease item quantity
  const decrease = async (itemId) => {
    try {
      if (user?.uid) {
        const item = cartItems.find((item) => item.itemId === itemId);
        if (item.quantity <= 1) {
          await removeItemById(user.uid, itemId);
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.itemId !== itemId)
          );
          console.log(`Item with ID ${itemId} removed from cart.`);
        } else {
          await decreaseQuantity(user.uid, itemId);
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  // Remove item from cart
  const remove = async (itemId) => {
    try {
      if (user?.uid) {
        await removeItemById(user.uid, itemId);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.itemId !== itemId)
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    try {
      if (user?.uid) {
        // Remove all items from the cart
        const cartItemsCopy = [...cartItems]; // Copy cart items for potential future use
        for (const item of cartItemsCopy) {
          await removeItemById(user.uid, item.itemId);
        }
        setCartItems([]); // Clear the cart in the UI
        console.log("Order placed successfully. Cart cleared.");
      } else {
        console.log("User not logged in. Cannot place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.heading}>{`${user?.username || 'Guest'}'s Cart`}</Text>
      </View>

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.itemId}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>
              </View>
              <TouchableOpacity onPress={() => remove(item.itemId)} style={styles.removeButton}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => decrease(item.itemId)} style={styles.circleBtn}>
                  <Text style={styles.circleBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increase(item.itemId)} style={styles.circleBtn}>
                  <Text style={styles.circleBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Your cart is empty.</Text>
        </View>
      )}

      <View style={styles.deliverySection}>
        <View style={styles.deliveryHeader}>
          <Text style={styles.deliveryTitle}>DELIVERY ADDRESS</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>EDIT</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.addressText}>2118 Thornridge Cir. Syracuse</Text>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.breakdown}>Breakdown</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={placeOrder} style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    position: 'relative',
    height: 40,
  },
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1, // Ensure the button is above other elements
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 20,
  },
  itemCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemPrice: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  itemSize: {
    color: '#aaa',
    fontSize: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleBtn: {
    backgroundColor: '#333',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 16,
  },
  deliverySection: {
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deliveryTitle: {
    color: '#aaa',
    fontSize: 12,
  },
  editText: {
    color: '#00aaff',
    fontSize: 12,
  },
  addressText: {
    color: '#fff',
    fontSize: 14,
  },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
  },
  totalAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  breakdown: {
    color: '#00aaff',
    fontSize: 12,
    marginTop: 5,
  },
  placeOrderButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cart;