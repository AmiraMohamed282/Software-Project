import React, { useState  , useLayoutEffect} from 'react';
import {  useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartItems , deleteCart} from "@/firebase/apis/carts";

const Cart = () => {
  
const dummyCart = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    price: 64,
    size: 'Regular',
    quantity: 2,
    image: 'https://hips.hearstapps.com/hmg-prod/images/grilled-chicken-salad-lead-6628169550105.jpg?resize=1200:*',
  },
  {
    id: '2',
    name: 'Tuna Salad',
    price: 32,
    size: 'Large',
    quantity: 1,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVwySLTfei6B-rZuFPTFknPwsSPTnHC4wViA&s',
  },
];
  const [cartItems, setCartItems] = useState(dummyCart);
  
  const router = useRouter();
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    // const userData = await AsyncStorage.getItem("user");
    // const user = JSON.parse(userData);
    // setUser(user);
    // const data = await getCartItems(user?.uid);
    // // console.log("Cart Items: ", data);
    // setCart(data);
  };

  useLayoutEffect(() => {
    fetchCurrentUser();
  }, []);
    const increase = (id) => {
      setCartItems(items =>
        items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      );
    };
  
    const decrease = (id) => {
      setCartItems(items =>
        items.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
      );
    };
  
    const remove = (id) => {
      setCartItems(items => items.filter(item => item.id !== id));
    };
  
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Text style={styles.backButton}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Cart</Text>
        </View>
  
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>
              </View>
              <TouchableOpacity onPress={() => remove(item.id)} style={styles.removeButton}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => decrease(item.id)} style={styles.circleBtn}>
                  <Text style={styles.circleBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increase(item.id)} style={styles.circleBtn}>
                  <Text style={styles.circleBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
  
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
            <Text style={styles.totalAmount}>${total}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.breakdown}>Breakdown</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.placeOrderButton}>
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
  export default Cart ; 