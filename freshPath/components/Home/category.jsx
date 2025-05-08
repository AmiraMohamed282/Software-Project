import { View, Text, FlatList, Image , StyleSheet, Dimensions , TouchableOpacity} from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config';

const { width, height } = Dimensions.get('window');

export default function Category() {
  const [diets,setDiets]=useState([]);
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef(null);
  const router = useRouter();

  useEffect(()=>{
    GetCategories();
  },[])
  const GetCategories=async()=>{
    setDiets([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
      querySnapshot.forEach((doc) => {
        setDiets(diets=>[...diets , doc.data()])

});
  }

  const onViewRef = useRef(({ changed }) => {
      if (changed[0].isViewable) {
        setActiveIndex(changed[0].index)
      }
    })


    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })
    
    const renderItem = ({ item }) => (
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
          source={{ uri: item.image }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
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
