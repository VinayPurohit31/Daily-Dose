import { View, Text ,StyleSheet, Image, TouchableOpacity} from 'react-native'
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import React, { useEffect, useState } from 'react'
import {getLocalStorage} from '../service/Storage'
import { FlatList } from 'react-native';
import Colors from '../constant/Colors';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';

import moment from 'moment';

const MedicationList = () => {
    const [medList,setMedList]=useState();
    const [dateRange,setDateRange]=useState();
    const [selectedDate,setSelectedDate]=useState(moment().format('MM/DD/YYYY'));

    useEffect(()=>{
        GetDateRangeList();
        GetMedicationList(selectedDate);
    },[])

    const GetDateRangeList=()=>{
        const dateRange=GetDateRangeToDisplay();
        setDateRange(dateRange);
    }

    const GetMedicationList=async(selectedDate)=>{
        const user=await getLocalStorage('userDetail');
        try{
            const q=query(collection(db,'medication'),
            where('userEmail','==',user?.email),
            where('dates','array-contains',selectedDate));


            const querySnapshot=await getDocs(q);
            setMedList([]);
            querySnapshot.forEach((doc)=>{
                console.log("docId:"+doc.id+'==>',doc.data())
                setMedList(prev=>[...prev,doc.data()])
            })
        }catch(e){
            console.log(e)
        }
    }

  return (
    <View style={styles.continer}>
      
      <Image style={styles.imageStyle} source={require('../assets/images/medication.jpeg')} />

      <FlatList
      style={styles.flatList}
      
      data={dateRange}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item,index})=>(
        <TouchableOpacity style={[styles.listDateGroup,{backgroundColor:item.formattedDate==selectedDate?Colors.PRIMARY:Colors.LIGHT_GRAY_BORDER}]} onPress={()=>setSelectedDate(item.formattedDate)}>
            <Text style={[styles.day,{color:item.formattedDate==selectedDate?'white':'black'}]}>{item.day}</Text>
            <Text style={[styles.date,{color:item.formattedDate==selectedDate?'white':'black'}]}>{item.date}</Text>
            </TouchableOpacity>
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