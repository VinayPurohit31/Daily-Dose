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

            const querySnapshot = await getDocs(q);
            let tempList = [];
            querySnapshot.forEach((doc) => {
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

            {/* Date Range List with Fixed Height */}
            <View style={styles.dateRangeContainer}>
                <FlatList
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
            </View>

            {/* Scrollable Medication List with Fixed Height */}
            <View style={styles.medListContainer}>
                <FlatList
                    data={medList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <MedicationCardItem medicine={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default MedicationList;

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
    },
    imageStyle: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    dateRangeContainer: {
        height: 100, // ✅ Fixes the issue (Adjust height as needed)
        marginTop: 15,
    },
    listDateGroup: {
        padding: 10,
        backgroundColor: Colors.LIGHT_GRAY_BORDER,
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
    medListContainer: {
        flex: 1,
        maxHeight: 400, // ✅ Fixes expanding issue (Adjust if needed)
    },
});
