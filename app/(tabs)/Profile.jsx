import { View, Text, Button } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FireBaseConfig'; // ✅ Ensure correct path
import { useRouter } from 'expo-router'; // ✅ Use router for navigation

export default function Profile() {
    const router = useRouter(); // ✅ Get router instance

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
                router.replace('/login/signin'); // ✅ Redirect to login screen
            })
            .catch((error) => {
                console.error('Error signing out:', error);
                alert('Logout failed: ' + error.message); // ✅ Show alert to the user
            });
    };

    return (
        <View>
            <Text>Profile</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
