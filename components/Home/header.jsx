import { View, Text , StyleSheet , Image} from 'react-native'
import {React, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors';
import { AuthContextProvider, useAuth } from "../../firebase/auth";

export default function Header() {
    const [user, setUser] = useState(null);
    const {loadUserFromStorage} = useAuth(); 
    const fetchUser = async () => {
        try {
            const userData = await loadUserFromStorage();
            console.log("Fetched User Data:", userData); // Debugging log
            if (userData) {
                setUser(userData); // Ensure this line is not commented out
            } else {
                console.log("No user data found in AsyncStorage.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    useEffect(() => {

        fetchUser();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.headLeft}>
                <Text      
                    style={{
                        fontSize: 18,
                        color: 'black',
                    }}>
                    Welcome
                </Text>
                <Text 
                    style={{
                        fontSize: 25,
                        color: 'black',
                    }}>
                    {user?.username || 'Guest'}
                </Text>
        </View>
            <Image 
                source={''} 
                style={styles.headimg}>
            </Image>
        </View>
    )
}
// backgroundColor:`${Colors.lightPrim}`}}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        padding: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor:'#498264'
    },
    headLeft:{
        elevation: 3,
    },
    headimg:{
        width: 40,
        height: 40,
        borderRadius: 18,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});