import { 
    View, StyleSheet, FlatList, 
    ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';

import { db } from '../../config/FireBaseConfig';
import { getLocalStorage } from '../../service/Storage';

import Colors from '../../constant/Colors';
import MedicationCardItemHistory from '../../components/MedicationCardItemHistory';

const History = () => {
    const [medList, setMedList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const router = useRouter();

    // useEffect(() => {
    //     GetDateRangeList();
    // }, []);

    useEffect(() => {
        GetMedicationList(selectedDate);
    }, [selectedDate]);

    // const GetDateRangeList = () => {
    //     const range = GetDateRangeToDisplay();
    //     setDateRange(range);
    // };

    const GetMedicationList = async (selectedDate) => {
        setLoading(true);
        setMedList([]);
      
        const user = await getLocalStorage('userDetail');
        if (!user?.email) return;
      
        try {
            const q = query(
                collection(db, 'medication'),
                where('userEmail', '==', user.email),

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

    const onRefresh = async () => {
        setRefreshing(true);
        await GetMedicationList(selectedDate);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
          

            <FlatList
                data={medList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MedicationCardItemHistory
                        medicine={item}
                        onDelete={() => handleDeleteMedication(item.id)}
                        status={item.status}
                    />
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.PRIMARY]} />
                }
                ListFooterComponent={loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />}
            />
        </View>
    );
};

export default History;
const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        flex: 1,
        paddingHorizontal: 15,
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

