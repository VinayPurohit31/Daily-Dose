import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/FireBaseConfig';
import { useRouter } from 'expo-router';
import { getDoc, doc } from 'firebase/firestore';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [adherenceRate, setAdherenceRate] = useState(null);
    const [medicationsTaken, setMedicationsTaken] = useState(0);
    const [medicationsMissed, setMedicationsMissed] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser({
                    name: currentUser.displayName || 'Anonymous',
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || 'https://via.placeholder.com/100',
                });

                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setAdherenceRate(userDoc.data().adherenceRate || 0);
                    setMedicationsTaken(userDoc.data().medicationsTaken || 0);
                    setMedicationsMissed(userDoc.data().medicationsMissed || 0);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
                router.replace('/login/signin');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
                alert('Logout failed: ' + error.message);
            });
    };

    return (
        <View style={styles.container}>
            {/* Profile Image */}
            <Image source={{ uri: user?.photoURL }} style={styles.profileImage} />

            {/* User Details */}
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            {/* Adherence Stats */}
            <View style={styles.statsCard}>
                <Text style={styles.statsText}>Adherence Rate: <Text style={styles.highlight}>{adherenceRate}%</Text></Text>
                <Text style={styles.statsText}>Taken: <Text style={styles.highlight}>{medicationsTaken}</Text> | Missed: <Text style={styles.highlight}>{medicationsMissed}</Text></Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/profileSetup/ProfileEdit')}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/profileSetup/Settings')}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('(tabs)/History')}>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('(tabs)/Report')}>
                    <Text style={styles.buttonText}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3f2fd',
        padding: 20,
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007bff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        width: '85%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 25,
    },
    statsText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444',
    },
    highlight: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '85%',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 4,
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

