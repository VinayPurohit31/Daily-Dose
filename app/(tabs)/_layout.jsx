import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth } from '../../config/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function TabLayout() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/login');
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, []);

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen 
                name='index'
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen 
                name='AddNew'
                options={{
                    tabBarLabel: 'Add New',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="plussquare" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen 
                name='Profile'
                options={{
                    tabBarLabel: 'Profile', // Fixed typo here
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
