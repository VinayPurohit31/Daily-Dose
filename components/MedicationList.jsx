import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';
import { getLocalStorage } from '../service/Storage';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import { MedicationCardItem } from "../components/MedacationCardItem";
import EmptyState from '../components/EmptyState'; // ✅ Import EmptyState

import Colors from '../constant/Colors';

const MedicationList = () => {
    const [medList, setMedList] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [loading, setLoading] = useState(false); // ✅ Loader state

    useEffect(() => {
        GetDateRangeList();
    }, []);

    useEffect(() => {
        GetMedicationList(selectedDate);
    }, [selectedDate]);

    const GetDateRangeList = () => {
        const range = GetDateRangeToDisplay();
        setDateRange(range);
    };

    const GetMedicationList = async (selectedDate) => {
        setLoading(true);
        setMedList([]); 

        const user = await getLocalStorage('userDetail');
        if (!user?.email) return;

        try {
            const q = query(
                collection(db, 'medication'),
                where('userEmail', '==', user.email),
                where('dates', 'array-contains', selectedDate)
            );

            const querySnapshot = await getDocs(q);
            let tempList = querySnapshot.docs.map(doc => doc.data());

            setMedList(tempList);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.imageStyle} source={require('../assets/images/medical_illustration.jpeg')} />

            {/* Date Range List (Fixed) */}
            <View style={styles.dateRangeContainer}>
                <FlatList
                    data={dateRange}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.formattedDate}
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

            {/* Medication List (Scrollable) */}
            <ScrollView contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.medListContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
                    ) : medList.length > 0 ? ( 
                        <FlatList
                            data={medList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <MedicationCardItem medicine={item} />}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={5}
                            maxToRenderPerBatch={5}
                            getItemLayout={(data, index) => ({
                                length: 100,
                                offset: 100 * index,
                                index,
                            })}
                        />
                    ) : (
                        <EmptyState message="No medication records found for this date." />
                    )}
                </View>
            </ScrollView>
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
        height: 100, 
        marginTop: 15,
        marginBottom:15
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
    scrollContainer: {
        flexGrow: 1, 
        paddingBottom: 20,
    },
    medListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    loader: {
        marginTop: 20,
        alignSelf: 'center',
    },
});
