import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import ConstantString from '../constant/ConstantString';
import Colors from '../constant/Colors';

const EmptyState = () => {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/no-vaccines.png')} style={styles.image} />
      <Text style={styles.lagel}>{ConstantString.NoMedication}</Text>
      <Text style={styles.slagel}>{ConstantString.MedicationSubText}</Text>
      <TouchableOpacity style={styles.buttonC} onPress={() => router.push('add-new-medication')}>
        <Text style={styles.buttonTextAddMed}>{ConstantString.AddNewMediciationBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginTop: 50,
    resizeMode: 'contain', // Keeps image proportions intact
  },
  container: {
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20, // Add some padding for a less cramped feel
  },
  lagel: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: Colors.DARK_BLUE, // Make the text stand out more with a darker color
  },
  slagel: {
    fontSize: 16,
    fontWeight: '500', // Slightly lighter than the title to differentiate
    textAlign: 'center',
    marginTop: 10,
    color: Colors.GRAY, // Using a gray color for better readability
    marginHorizontal: 30, // Add some horizontal margin to avoid text running too close to the edges
  },
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
});
