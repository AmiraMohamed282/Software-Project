import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Slider from '../../components/Home/slider'
import Category from '../../components/Home/category'


export default function Home() {
  return (
    <View style={styles.container}>
      {/* slider */}
        <Header />
        <Slider/>
        <Category />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
    // marginTop: 30,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});