import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function MedicationActionModel() {
  const medicine = useLocalSearchParams();
  const router = useRouter();

  console.log(medicine);

  const handleCancel = () => {
    console.log('Cancel button pressed');
    // Add your cancel logic here
  };

  const handleTaken = () => {
    console.log('Taken button pressed');
    // Add your taken logic here
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      {/* Notification Image */}
      <Image
        source={require('./../../assets/images/notification.gif')}
        style={styles.image}
      />

      {/* Medication Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medication Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{medicine?.selectedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reminder:</Text>
          <Text style={styles.detailValue}>{medicine?.reminder}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Illness:</Text>
          <Text style={styles.detailValue}>{medicine?.illnessName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Medication:</Text>
          <Text style={styles.detailValue}>{medicine?.medName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>When:</Text>
          <Text style={styles.detailValue}>{medicine?.when}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dose:</Text>
          <Text style={styles.detailValue}>{medicine?.dose} {medicine?.type?.name}</Text>
        </View>
      </View>

      {/* Action Message */}
      <Text style={styles.actionText}>It's time to take your medicine!</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.takenButton]} onPress={handleTaken}>
          <Text style={styles.buttonText}>Taken</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.DARK,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: Colors.SECONDARY,
    fontWeight: '400',
  },
  actionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: Colors.GRAY,
  },
  takenButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});