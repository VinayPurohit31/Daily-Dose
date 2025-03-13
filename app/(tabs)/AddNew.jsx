import { View, Text,StyleSheet,TouchableOpacity} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';


import ConstantString from '../../constant/ConstantString';
import Colors from '../../constant/Colors';
import EmptyState2 from '../../components/EmptyState2';

export default function AddNew() {
    const router = useRouter();
    return (
        <View style={styles.container}>
           <EmptyState2/>
           
        </View>
    )
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})