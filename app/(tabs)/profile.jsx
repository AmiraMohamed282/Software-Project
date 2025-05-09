
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import ProfileInfo from '../ProfileInfo'
import {auth, db} from '../../firebase/config'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';


const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.log("⚠️ No user data found!");
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
      {user ? (<>
          <Image
            source={{ uri: user.image || 'https://randomuser.me/api/portraits/men/15.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.name}> {user.username} </Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
        {/* <Text style={styles.subtitle}>I love fast food</Text> */}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={() => { router.replace('ProfileInfo');}}>
          <Ionicons name="person-outline" size={24} style={styles.icon} />
          <Text>Profile Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="location" size={24} style={styles.icon}/>
          <Text> Addresses </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
      <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="cart" size={24} style={styles.icon}/>
          <Text style={styles.label}> Cart </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="heart-outline" size={24} style={styles.icon} />
          <Text style={styles.label}> Favourite </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
      <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="help-circle-outline" size={24} style={styles.icon}/>
          <Text style={styles.label}> FAQs </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="star" size={24} style={styles.icon}/>
          <Text style={styles.label}> User Reviews </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
      <TouchableOpacity style={styles.item} onPress={() => { router.replace('');}}>
          <Ionicons name="log-out" size={24} style={styles.icon}/>
          <Text style={styles.label}> Log Out </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.icon}>{icon}</View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F6FA',
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: '#fff',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      marginBottom: 10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
    },
    subtitle: {
      fontSize: 14,
      color: '#888',
    },
    section: {
      backgroundColor: '#fff',
      marginVertical: 5,
      borderRadius: 15,
      paddingVertical: 10,
      marginHorizontal: 15,
      paddingHorizontal: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    icon: {
      width: 30,
    },
    label: {
      fontSize: 16,
      marginLeft: 10,
      color: '#333',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    icon: {
      marginRight: 12,
    },
    label: {
      fontSize: 16,
      color: '#333',
    },    
  });
  
export default ProfileScreen;