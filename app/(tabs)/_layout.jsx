import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen 
                name='index'
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen 
                name='AddNew'
                options={{
                    tabBarLabel: 'Add New',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="plussquare" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen 
                name='Profile'
                options={{
                    tabbarlabal: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="user" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}
