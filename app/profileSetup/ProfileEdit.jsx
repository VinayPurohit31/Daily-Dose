import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/FireBaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProfileEdit({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setName(userDoc.data().name);
                    setEmail(userDoc.data().email);
                } else {
                    setName(user.displayName || '');
                    setEmail(user.email || '');
                }
            }
        };

        fetchUserProfile();
    }, []);

    const updateUserProfile = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                await updateDoc(userDocRef, { name, email });
            } else {
                await setDoc(userDocRef, { name, email });
            }

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack(); // Navigate back to profile screen
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />
            <Button title="Save Profile" onPress={updateUserProfile} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
});
