import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function MedicationActionModel() {
    const medicine = useLocalSearchParams();
    console.log(medicine);
  return (
    <View>
      <Text>MedicationActionModel</Text>
    </View>
  )
}