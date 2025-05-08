import { View, Text , StyleSheet , Image} from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors';


export default function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.headLeft}>
                <Text      
                    style={{
                        fontSize:18,
                        color:'white',
                }}>
                    Welcome
                </Text>
                <Text 
                    style={{
                        fontSize:25,
                        color:'white',
                }}>UserName</Text>
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