import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/FireBaseConfig';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function ProfileEdit() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialName, setInitialName] = useState('');

    // Set up real-time listener for user data
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            router.push('/login');
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                setName(userData.name || user.displayName || '');
                setInitialName(userData.name || user.displayName || '');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            if (!name.trim()) {
                Alert.alert('Error', 'Name cannot be empty');
                return;
            }

            if (name === initialName) {
                Alert.alert('Info', 'No changes made');
                return;
            }

            setLoading(true);
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const userDocRef = doc(db, 'users', user.uid);
            
            await setDoc(userDocRef, { 
                name: name.trim(),
                updatedAt: new Date().toISOString() 
            }, { merge: true });

            Alert.alert('Success', 'Name updated successfully!');
            router.back();
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update name: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            
            <Text style={styles.label}>Your Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                editable={!loading}
                autoFocus
            />

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    (loading || name === initialName) && styles.saveButtonDisabled
                ]}
                onPress={handleUpdateProfile}
                disabled={loading || name === initialName}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 25,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#A0C4FF',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});