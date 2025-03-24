import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';

import { db } from '../config/FireBaseConfig';
import { getLocalStorage } from '../service/Storage';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import MedicationCardItem from "../components/MedacationCardItem";
import EmptyState from '../components/EmptyState';
import Colors from '../constant/Colors';

const MedicationList = () => {
    const [medList, setMedList] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            let tempList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
            const medListWithStatus = await Promise.all(
                tempList.map(async (med) => {
                    const statusDocRef = doc(db, 'medications', `${med.id}_${selectedDate}`);
                    const statusDocSnap = await getDoc(statusDocRef);
      
                    let takenCount = 0;
                    let missedCount = 0;
                    const reminders = med.reminder || [];
      
                    if (statusDocSnap.exists()) {
                        const data = statusDocSnap.data();
                        reminders.forEach(time => {
                            if (data[time] === 'taken') takenCount++;
                            else if (data[time] === 'missed') missedCount++;
                        });
                    }
      
                    const totalReminders = reminders.length;
      
                    return {
                        ...med,
                        status: {
                            takenCount,
                            missedCount,
                            totalReminders,
                            isFullyTaken: takenCount === totalReminders && totalReminders > 0,
                            isPartiallyTaken: takenCount > 0 && takenCount < totalReminders,
                            isNotTaken: takenCount === 0 && missedCount === 0,
                            isFullyMissed: missedCount === totalReminders && totalReminders > 0,
                        },
                    };
                })
            );
      
            setMedList(medListWithStatus);
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Failed to load medications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMedication = async (medId) => {
        Alert.alert(
            "Delete Medication",
            "Are you sure you want to delete this medication permanently?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'medication', medId));
                            setMedList(prev => prev.filter(med => med.id !== medId));
                            Alert.alert("Success", "Medication deleted successfully!");
                        } catch (e) {
                            console.log(e);
                            Alert.alert("Error", "Failed to delete medication. Please try again.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Image style={styles.imageStyle} source={require('../assets/images/medical_illustration.jpeg')} />

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

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.medListContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
                    ) : medList.length > 0 ? (
                        <FlatList
                            data={medList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <MedicationCardItem
                                    medicine={item}
                                    onDelete={() => handleDeleteMedication(item.id)}
                                    selectedDate={selectedDate}
                                    status={item.status}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
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
        marginTop: 10,
        flex: 1,
        paddingHorizontal: 15,
    },
    imageStyle: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    dateRangeContainer: {
        height: 100,
        // width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    listDateGroup: {
        padding: 10,
        backgroundColor: Colors.LIGHT_GRAY_BORDER,
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 15,
        width: 60,
    },
    day: {
        fontSize: 16,
    },
    date: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    medListContainer: {
        flex: 1,
    },
    loader: {
        marginTop: 20,
        alignSelf: 'center',
    },
});

