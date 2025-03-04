import { View, Text, Button } from 'react-native';
import React from 'react';

import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import MedicationList from '../../components/MedicationList';


export default function HomeScreen() {
    return (
        <View style={{padding: 25,backgroundColor: 'white',height: '100%'}}>
            <Header />

            <MedicationList/>
            
        </View>
    );
}
