import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';
import { getLocalStorage } from '../service/Storage';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import { MedicationCardItem } from "../components/MedacationCardItem";
import Colors from '../constant/Colors';

const MedicationList = () => {
    const [medList, setMedList] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));

    useEffect(() => {
        GetDateRangeList();
        GetMedicationList(selectedDate);
    }, [selectedDate]);

    const GetDateRangeList = () => {
        const range = GetDateRangeToDisplay();
                    console.log("BSDK:"+medList)

        setDateRange(range);
    };

    const GetMedicationList = async (selectedDate) => {
        const user = await getLocalStorage('userDetail');
        if (!user?.email) return;
        
        try {
            const q = query(
                collection(db, 'medication'),
                where('userEmail', '==', user.email),
                where('dates', 'array-contains', selectedDate)
                
            );
            console.log(user.email)
                console.log(selectedDate)

            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            let tempList = [];
            querySnapshot.forEach((doc) => {
                console.log("docId: " + doc.id + ' ==> ', doc.data());
                tempList.push(doc.data());
            });
            setMedList(tempList);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.imageStyle} source={require('../assets/images/medical_illustration.jpeg')} />

            <FlatList
                style={styles.flatList}
                data={dateRange}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[
                            styles.listDateGroup, 
                            { backgroundColor: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.LIGHT_GRAY_BORDER }
                        ]}
                        onPress={() => setSelectedDate(item.formattedDate)}
                    >
                        <Text style={[styles.day, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>
                            {item.day}
                        </Text>
                        <Text style={[styles.date, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>
                            {item.date}
                        </Text>
                    </TouchableOpacity>
                )}
            />


            <FlatList
                data={medList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <MedicationCardItem medicine={item} />}
                
            />
        </View>
    );
};

export default MedicationList;

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
    imageStyle: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    flatList: {
        marginTop: 15,
    },
    listDateGroup: {
        padding: 10,
        backgroundColor: Colors.LIGHT_GRAY_BORDER,
        display: 'flex',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 15,
    },
    day: {
        fontSize: 20,
    },
    date: {
        fontSize: 26,
        fontWeight: 'bold',
    },
});
