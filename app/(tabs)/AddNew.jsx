import { View, Text,StyleSheet,TouchableOpacity} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';


import ConstantString from '../../constant/ConstantString';
import Colors from '../../constant/Colors';

export default function AddNew() {
    const router = useRouter();
    return (
        <View style={styles.container}>
           
            <TouchableOpacity style={styles.buttonC} onPress={() => router.push('add-new-medication')}>
                    <Text style={styles.buttonTextAddMed}>{ConstantString.AddNewMediciation}</Text>
                  </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
buttonC: {
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30, // Increased top margin for a cleaner layout
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor:Colors.PRIMARY,
    shadowColor: '#0084ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    width: '90%', // Make button width more consistent and centered
  },
  buttonTextAddMed: {
    fontSize: 16,
    color: 'white', // White text for better contrast
    fontWeight: 'bold',
  },
  container: {
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20, // Add some padding for a less cramped feel
  },
})