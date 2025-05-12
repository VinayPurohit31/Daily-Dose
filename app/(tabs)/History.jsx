import { 
    View, StyleSheet, FlatList, 
    ActivityIndicator, Alert, RefreshControl,
    TextInput, TouchableOpacity, Text 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { db } from '../../config/FireBaseConfig';
import { getLocalStorage } from '../../service/Storage';
import Colors from '../../constant/Colors';
import MedicationCardItemHistory from '../../components/MedicationCardItemHistory';

const History = () => {
    const [medList, setMedList] = useState([]);
    const [filteredMeds, setFilteredMeds] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('name'); // 'name', 'date', 'status'
    const [showSortOptions, setShowSortOptions] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        GetMedicationList(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMeds(medList);
        } else {
            const filtered = medList.filter(med => 
                med.medName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                med.illnessName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMeds(filtered);
        }
    }, [searchQuery, medList]);

    const sortMedications = () => {
        let sorted = [...filteredMeds];
        
        switch (sortOption) {
            case 'name':
                sorted.sort((a, b) => a.medName.localeCompare(b.medName));
                break;
            case 'date':
                sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                break;
            case 'status':
                sorted.sort((a, b) => {
                    // Sort by completion status (fully taken > partially taken > not taken > fully missed)
                    if (a.status.isFullyTaken && !b.status.isFullyTaken) return -1;
                    if (!a.status.isFullyTaken && b.status.isFullyTaken) return 1;
                    if (a.status.isPartiallyTaken && !b.status.isPartiallyTaken) return -1;
                    if (!a.status.isPartiallyTaken && b.status.isPartiallyTaken) return 1;
                    if (a.status.isNotTaken && !b.status.isNotTaken) return -1;
                    if (!a.status.isNotTaken && b.status.isNotTaken) return 1;
                    return 0;
                });
                break;
            default:
                break;
        }
        
        setFilteredMeds(sorted);
    };

    useEffect(() => {
        if (filteredMeds.length > 0) {
            sortMedications();
        }
    }, [sortOption]);

    const GetMedicationList = async (selectedDate) => {
        setLoading(true);
        setMedList([]);
      
        const user = await getLocalStorage('userDetail');
        if (!user?.email) return;
      
        try {
            const q = query(
                collection(db, 'medication'),
                where('userEmail', '==', user.email)
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
            setFilteredMeds(medListWithStatus);
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
                            setFilteredMeds(prev => prev.filter(med => med.id !== medId));
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

    const renderSearchAndSort = () => (
        <View style={styles.searchSortContainer}>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color={Colors.GRAY} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search medications..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={Colors.GRAY}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Feather name="x" size={20} color={Colors.GRAY} />
                    </TouchableOpacity>
                )}
            </View>
            
            <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setShowSortOptions(!showSortOptions)}
            >
                <MaterialIcons name="sort" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
        </View>
    );

    const renderSortOptions = () => (
        <View style={styles.sortOptionsContainer}>
            <TouchableOpacity 
                style={styles.sortOption}
                onPress={() => {
                    setSortOption('name');
                    setShowSortOptions(false);
                }}
            >
                <Text style={[styles.sortOptionText, sortOption === 'name' && styles.activeSortOption]}>
                    Sort by Name
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.sortOption}
                onPress={() => {
                    setSortOption('date');
                    setShowSortOptions(false);
                }}
            >
                <Text style={[styles.sortOptionText, sortOption === 'date' && styles.activeSortOption]}>
                    Sort by Date
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.sortOption}
                onPress={() => {
                    setSortOption('status');
                    setShowSortOptions(false);
                }}
            >
                <Text style={[styles.sortOptionText, sortOption === 'status' && styles.activeSortOption]}>
                    Sort by Status
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderSearchAndSort()}
            {showSortOptions && renderSortOptions()}

            <FlatList
                data={filteredMeds}
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
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={[Colors.PRIMARY]} 
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <Text style={styles.noResultsText}>
                            {searchQuery ? 'No medications match your search' : 'No medications found'}
                        </Text>
                    )
                }
                ListFooterComponent={loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        flex: 1,
        paddingHorizontal: 15,
    },
    searchSortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: Colors.BLACK,
    },
    sortButton: {
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    sortOptionsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        elevation: 2,
    },
    sortOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.LIGHT_GRAY,
    },
    sortOptionText: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    activeSortOption: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        color: Colors.GRAY,
        fontSize: 16,
    },
    loader: {
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },
});

export default History;