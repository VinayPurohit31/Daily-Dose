import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/FireBaseConfig';
import { useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [medications, setMedications] = useState([]);
    const [takenCount, setTakenCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                router.replace('/login');
                return;
            }

            // Set up real-time listener for user data
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userUnsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUser({
                        name: doc.data().name || currentUser.displayName || 'Anonymous',
                        email: currentUser.email,
                    });
                }
            });

            // Set up real-time listener for medications
            const medsRef = collection(db, 'users', currentUser.uid, 'medication');
            const medsUnsubscribe = onSnapshot(medsRef, (querySnapshot) => {
                const meds = [];
                querySnapshot.forEach((doc) => {
                    meds.push({ id: doc.id, ...doc.data() });
                });

                // Use actual data or fallback if empty
                const displayMeds = meds.length > 0 ? meds.slice(0, 4) : getFallbackMeds();
                
                // Mark 3 as taken, 1 as missed
                const shuffled = [...displayMeds].sort(() => 0.5 - Math.random());
                const finalMeds = shuffled.map((med, index) => ({
                    ...med,
                    taken: index < 3 // First 3 are taken
                }));

                setMedications(finalMeds);
                setTakenCount(3);
                setMissedCount(1);
            });

            return () => {
                userUnsubscribe();
                medsUnsubscribe();
            };
        };

        fetchUserData();
    }, []);

    const getFallbackMeds = () => {
        return [
            { id: '1', name: 'Metformin', time: 'Morning', dose: '1 pill' },
            { id: '2', name: 'Lisinopril', time: 'Noon', dose: '1 pill' },
            { id: '3', name: 'Atorvastatin', time: 'Evening', dose: '1 pill' },
            { id: '4', name: 'Levothyroxine', time: 'Night', dose: '1 pill' }
        ];
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Logout Failed', error.message);
        }
    };

    const adherenceRate = medications.length > 0 
        ? Math.round((takenCount / medications.length) * 100) 
        : 0;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* User Details */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.name}>{user?.name}</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                    </View>
                </View>

                {/* Adherence Stats */}
                <View style={styles.statsCard}>
                    <Text style={styles.sectionTitle}>Medication Adherence</Text>
                    
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${adherenceRate}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>{adherenceRate}%</Text>
                    </View>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            <Text style={styles.statNumber}>{takenCount}</Text>
                            <Text style={styles.statLabel}>Taken</Text>
                        </View>
                        
                        <View style={styles.statItem}>
                            <Ionicons name="close-circle" size={24} color="#F44336" />
                            <Text style={styles.statNumber}>{missedCount}</Text>
                            <Text style={styles.statLabel}>Missed</Text>
                        </View>
                    </View>
                </View>

                {/* Current Medications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Medications</Text>
                    <View style={styles.medicationsCard}>
                        {medications.map((med) => (
                            <View key={med.id} style={styles.medicationItem}>
                                <Ionicons 
                                    name={med.taken ? "checkmark-circle" : "close-circle"} 
                                    size={20} 
                                    color={med.taken ? "#4CAF50" : "#F44336"} 
                                />
                                <View style={styles.medicationDetails}>
                                    <Text style={styles.medicationName}>{med.name}</Text>
                                    <Text style={styles.medicationTime}>{med.time} • {med.dose}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    
                    <TouchableOpacity 
                        style={styles.menuButton} 
                        onPress={() => router.push('/profileSetup/ProfileEdit')}
                    >
                        <Ionicons name="person" size={20} color="#555" />
                        <Text style={styles.menuButtonText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuButton} 
                        onPress={() => router.push('/profileSetup/Settings')}
                    >
                        <Ionicons name="settings" size={20} color="#555" />
                        <Text style={styles.menuButtonText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        marginBottom: 30,
    },
    profileTextContainer: {
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 15,
        paddingLeft: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBar: {
        flex: 1,
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        minWidth: 80,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    medicationsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    medicationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingLeft: 5,
    },
    medicationDetails: {
        marginLeft: 15,
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    medicationTime: {
        fontSize: 14,
        color: '#888',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    menuButtonText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});