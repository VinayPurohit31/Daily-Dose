import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';
import { getLocalStorage } from '../service/Storage';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import { MedicationCardItem } from "../components/MedacationCardItem";
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
            let tempList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Include document ID
            setMedList(tempList);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMedication = async (medId) => {
        // Confirmation dialog
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
                            await deleteDoc(doc(db, 'medication', medId)); // Delete from Firestore
                            setMedList(prev => prev.filter(med => med.id !== medId)); // Update local state
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

            {/* Date Range List */}
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

            {/* Medication List */}
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
                                    selectedDate={selectedDate} // Pass delete handler
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
        marginBottom: 15,
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