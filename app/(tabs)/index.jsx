import { View, Text, Button } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FireBaseConfig'; // ✅ Import from your config file

export default function HomeScreen() {
    return (
        <View>
            <Text>Index</Text>
            <Button title='Logout' onPress={() => signOut(auth)
                .then(() => console.log('User signed out'))
                .catch((error) => console.error('Error signing out:', error))
            } />
        </View>
    );
}
