import { View, Text ,StyleSheet, Image} from 'react-native'
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native';
import Colors from '../constant/Colors';

const MedicationList = () => {
    const [medList,setMedList]=useState();
    const [dateRange,setDateRange]=useState();

    useEffect(()=>{
        GetDateRangeList();
    },[])

    const GetDateRangeList=()=>{
        const dateRange=GetDateRangeToDisplay();
        setDateRange(dateRange);
    }

  return (
    <View style={styles.continer}>
      
      <Image style={styles.imageStyle} source={require('../assets/images/medication.jpeg')} />

      <FlatList
      style={styles.flatList}
      
      data={dateRange}
      horizontal
      showsHorizontalScrollIndicato={false}
      renderItem={({item,index})=>(
        <View style={styles.listDateGroup}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.date}>{item.date}</Text>
            </View>
      )}
      />
    </View>
  )
}

export default MedicationList

const styles = StyleSheet.create({
    continer:{
        marginTop:25,
       
    },
    imageStyle:{
        width:'100%',
        height:200,
        borderRadius:15
    },
    flatList:{
        marginTop:15
    },
    listDateGroup:{
        padding:10,
        backgroundColor:Colors.LIGHT_GRAY_BORDER,
        display:'flex',
        alignItems:'center',
        marginRight:10,
        borderRadius:15
    },
    day:{
        fontSize:20
    },
    date:{
        fontSize:26,
        fontWeight:'bold'
    }
})