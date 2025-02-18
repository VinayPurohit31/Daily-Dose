import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import ConstantString from '../constant/ConstantString';
import { FlatList, TextInput } from 'react-native-web';
import Colors from '../constant/Colors';
import { TypeList } from '../constant/Options';

export default function AddMedForm() {

    const [formData,setFormData] =useState();

    const onHandleInputChange = (field,value) => {
        setFormData(prev=>({...prev,[field]:value}));
    }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{ConstantString.AddNewMediciation}.</Text>
      <View style={styles.input}>
        <AntDesign style={styles.icon} name="medicinebox" size={24} color="black" />
        <TextInput style={styles.textInput} placeholder='Medication Name' onChangeText={(value)=>onHandleInputChange('name',value)} />
      </View>

      {/* Type List */}

      <FlatList data={TypeList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index}) => (
        <TouchableOpacity onPress={()=>onHandleInputChange('type',item)} style={styles.inputGroupStyle}>
            <Text style={styles.typeText}>{item?.name}</Text>
        </TouchableOpacity>
        )}/>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
       
    },
    input: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius:8,
        borderColor:Colors.GRAY,
    },
    textInput: {
        flex:1,
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        color: Colors.PRIMARY,
        marginRight: 10,    
        borderRightWidth:1,
        paddingRight:15,
        borderColor:Colors.GRAY,
    },
    inputGroupStyle:{
        padding:10,
        borderWidth:1,
        borderRadius:8,
        borderColor:Colors.GRAY,
        marginRight:10,  
        marginTop:10,
    },
    typeText:{
        fontSize:13,      
    }

    });