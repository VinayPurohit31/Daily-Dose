import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function MedicationActionModel() {
  const medicine = useLocalSearchParams();
  const router = useRouter();

  const reminders = useMemo(() => JSON.parse(medicine.reminders || '[]'), [medicine.reminders]);

  const [selectedTime, setSelectedTime] = useState('');
  const [reminderTimes, setReminderTimes] = useState([]);

  useEffect(() => {
    if (reminders && Array.isArray(reminders)) {
      setReminderTimes(reminders);
      setSelectedTime(reminders.length > 0 ? reminders[0] : '');
    }
  }, [reminders]);

  const handleCancel = () => { };
  const handleTaken = () => { };
  const handleBack = () => { router.back(); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <Image source={require('./../../assets/images/notification.gif')} style={styles.image} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medication Details</Text>
        {[
          { label: 'Date', value: medicine?.selectedDate },
          { label: 'Illness', value: medicine?.illnessName },
          { label: 'Medication', value: medicine?.medName },
          { label: 'When', value: medicine?.when },
          { label: 'Dose', value: medicine?.dose }
        ].map((item, index) => (
          <View style={styles.detailRow} key={index}>
            <Text style={styles.detailLabel}>{item.label}:</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.actionText}>Select Reminder Time</Text>
      {reminderTimes.length > 0 ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
            dropdownIconColor={Colors.PRIMARY}
          >
            {reminderTimes.map((time, index) => (
              <Picker.Item key={index} label={time} value={time} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={styles.noReminderText}>No reminders set for this medication.</Text>
      )}

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
  container: { flex: 1, padding: 20, backgroundColor: Colors.LIGHT_BACKGROUND },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.PRIMARY, flex: 1, textAlign: 'center' },
  image: { width: 150, height: 150, alignSelf: 'center', marginBottom: 20, borderRadius: 10 },
  card: { backgroundColor: Colors.WHITE, borderRadius: 15, padding: 25, marginBottom: 20,borderColor: Colors.LIGHT_GRAY_BORDER, borderWidth: 3 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 15, textAlign: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 18, fontWeight: '600', color: Colors.DARK },
  detailValue: { fontSize: 18, color: Colors.SECONDARY, fontWeight: '500' },
  actionText: { fontSize: 22, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 10, textAlign: 'center' },
  pickerContainer: { width: '100%', backgroundColor: Colors.WHITE, borderRadius: 12, marginBottom: 20, borderWidth: 3, borderColor: Colors.LIGHT_GRAY_BORDER, paddingHorizontal: 15 },
  picker: { width: '100%', height: 55,},
  noReminderText: { fontSize: 18, color: Colors.GRAY, textAlign: 'center', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
  button: { flex: 1, paddingVertical: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  cancelButton: { backgroundColor: Colors.GRAY },
  takenButton: { backgroundColor: Colors.PRIMARY },
  buttonText: { color: Colors.WHITE, fontSize: 18, fontWeight: 'bold' },
});
