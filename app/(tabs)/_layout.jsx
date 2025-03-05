import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getLocalStorage } from '../../service/Storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function TabLayout() {
    const router = useRouter();

    useEffect(() => {
        GetuserDetail();
    }, []);

    const GetuserDetail=async()=>{
        const userInfo= await getLocalStorage('userDetail');
        if(!userInfo){
            router.replace('/login')

    }
    }
    


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
                name='Report'
                options={{
                    tabBarLabel: 'Reports', // Fixed typo here
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="sticky-note" size={24} color={color} />
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
