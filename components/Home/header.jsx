import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


export default function Header() {
    const { loadUserFromStorage } = useAuth();
    const [userName, setUserName] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await loadUserFromStorage();
                if (userData) {
                    setUserName(userData.username);
                } else {
                    console.log('No user data found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching user data from AsyncStorage:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headLeft}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.userName}>{userName || 'User'}</Text>
            </View>

            <View style={styles.rightSection}>
                <View style={styles.searchContainer}>
                    <TextInput 
                        placeholder="Search"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                </View>

                <TouchableOpacity style={styles.cartIcon}>
                    <Icon name="shopping-cart" size={20} color="#000" />
                </TouchableOpacity>
            </View>
             
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#1f3d2c',
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },
    headLeft: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: '#eee',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        width: 150,
        marginRight: 15,
    },
    searchInput: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 14,
    },
    cartIcon: {
        padding: 5,
    },
});
