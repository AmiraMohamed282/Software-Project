import { View, Text, FlatList, Image , StyleSheet, Dimensions , TouchableOpacity} from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/config';
import Header from './header'

const { width } = Dimensions.get('window');

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef(null);

  useEffect(() => {
    GetSliders();
  }, []);

  const GetSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Siders"));
    querySnapshot.forEach((doc) => {
      setSliderList(sliderList => [...sliderList, doc.data()]);
    });
  };

  const onViewRef = useRef(({ changed }) => {
    if (changed[0].isViewable) {
      setActiveIndex(changed[0].index)
    }
  })

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item?.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {sliderList.length > 1 && (
        <View style={styles.pagination}>
          {sliderList.map((_, index) => (
            <View key={index} style={[styles.paginationDot, index === activeIndex ? styles.paginationDotActive : {}]} />
          ))}
        </View>
      )}
      <Header/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  imageContainer: {
    width: width,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 17, // النسبة دي ممكن تغيريها حسب شكل صورك
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})
