import { View, Text ,StyleSheet, Image} from 'react-native'
import React, { useState } from 'react'

const MedicationList = () => {
    const [medList,setMedList]=useState();
  return (
    <View style={styles.continer}>
      <Text>MedicationList</Text>
      <Image style={styles.imageStyle} source={require('../assets/images/medication.jpeg')} />
    </View>
  )
}

export default MedicationList

const styles = StyleSheet.create({
    continer:{
        marginTop:25
    },
    imageStyle:{
        width:'100%',
        height:200,
        borderRadius:15
    }
})