import { View, Text, FlatList, Image , StyleSheet, Dimensions , TouchableOpacity} from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from 'expo-router';
import { db } from '../../firebase/config';

const { width, height } = Dimensions.get('window');

export default function Category() {
  const [diets,setDiets]=useState([]);
  const router = useRouter();

  useEffect(()=>{
    GetCategories();
  },[])
  const GetCategories = async () => {
    setDiets([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() }); // ناخد الـ id ونضيفه مع باقي الـ data
    });
    setDiets(categories); 
    console.log(categories); // أو
    console.log(diets)// نحط كلهم مرة واحدة بدل ما نستخدم setDiets في لوب
  };
    
    const renderItem = ({ item }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/category/${item.id}`)}
      style={{
        margin: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#eee',
        padding: 10
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{item.name}</Text>
    </TouchableOpacity>
  );
};

  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Categories</Text>
      <FlatList
        data={diets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
</View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 250,
  },
  imageContainer: {
    width,
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
})
