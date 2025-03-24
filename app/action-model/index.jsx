import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { db } from '../../config/FireBaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function MedicationActionModel() {
  const medicine = useLocalSearchParams();
  const router = useRouter();

  const reminders = useMemo(() => JSON.parse(medicine.reminders || '[]'), [medicine.reminders]);

  const [selectedTime, setSelectedTime] = useState('');
  const [reminderTimes, setReminderTimes] = useState([]);
  const [takenReminders, setTakenReminders] = useState(new Set());
  const [missedReminders, setMissedReminders] = useState(new Set());

  useEffect(() => {
    if (reminders && Array.isArray(reminders)) {
      setReminderTimes(reminders);
      if (!selectedTime && reminders.length > 0) {
        setSelectedTime(reminders[0]);
      }
    }
    fetchTakenStatus();
  }, [medicine]);

  const fetchTakenStatus = async () => {

    const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setTakenReminders(new Set(data.takenReminders || []));
      setMissedReminders(new Set(data.missedReminders || []));
    }
  };

  const handleTaken = async () => {
    if (selectedTime) {
      const updatedTakenReminders = new Set([...takenReminders, selectedTime]);
      setTakenReminders(updatedTakenReminders);
      setMissedReminders((prev) => new Set([...prev].filter((time) => time !== selectedTime)));

      const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
      await setDoc(docRef, {
        takenReminders: Array.from(updatedTakenReminders),
        missedReminders: Array.from(missedReminders),
      }, { merge: true });
    }
  };

  const handleMissed = async () => {
    if (selectedTime) {
      const updatedMissedReminders = new Set([...missedReminders, selectedTime]);
      setMissedReminders(updatedMissedReminders);
      setTakenReminders((prev) => new Set([...prev].filter((time) => time !== selectedTime)));

      const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
      await setDoc(docRef, {
        missedReminders: Array.from(updatedMissedReminders),
        takenReminders: Array.from(takenReminders),
      }, { merge: true });
    }
  };

  const handleCancel = async () => {
    if (selectedTime && takenReminders.has(selectedTime)) {
      const updatedTakenReminders = new Set(takenReminders);
      updatedTakenReminders.delete(selectedTime);
      setTakenReminders(updatedTakenReminders);
      const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
      await updateDoc(docRef, { takenReminders: Array.from(updatedTakenReminders) });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication Details</Text>
      </View>

      <View style={styles.imageContainer}>
        <FontAwesome name="bell-o" size={120} color={Colors.PRIMARY} />
      </View>

      <View style={styles.card}>
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
      <View style={styles.pickerContainer}>
        {reminderTimes.length > 0 ? (
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
            dropdownIconColor={Colors.PRIMARY}
          >
            {reminderTimes.map((time, index) => (
              <Picker.Item
                key={index}
                label={`${time} ${takenReminders.has(time) ? '✔️' : missedReminders.has(time) ? '❌' : ''}`}
                value={time}
              />
            ))}
          </Picker>
        ) : (
          <Text style={styles.noReminderText}>No reminders set for this medication.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cancelButton,
            (takenReminders.size + missedReminders.size === reminderTimes.length) && styles.disabledButton,
          ]}
          onPress={handleCancel}
          disabled={takenReminders.size + missedReminders.size === reminderTimes.length}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.missedButton,
            (takenReminders.size + missedReminders.size === reminderTimes.length) && styles.disabledButton,
          ]}
          onPress={handleMissed}
          disabled={takenReminders.size + missedReminders.size === reminderTimes.length || missedReminders.has(selectedTime)}
        >
          <Text style={styles.buttonText}>Missed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.takenButton,
            (takenReminders.size + missedReminders.size === reminderTimes.length) && styles.disabledButton,
          ]}
          onPress={handleTaken}
          disabled={takenReminders.size + missedReminders.size === reminderTimes.length || takenReminders.has(selectedTime)}
        >
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.PRIMARY, marginLeft: 10 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  card: { backgroundColor: Colors.BACKGROUND, borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 18, fontWeight: '600', color: Colors.DARK },
  detailValue: { fontSize: 18, color: Colors.SECONDARY, fontWeight: '500' },
  actionText: { fontSize: 20, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 10, textAlign: 'center' },
  pickerContainer: { backgroundColor: Colors.BACKGROUND, borderRadius: 10, marginBottom: 20, paddingHorizontal: 10, elevation: 2 },
  picker: { height: 50 },
  noReminderText: { fontSize: 18, color: Colors.GRAY, textAlign: 'center', marginBottom: 20 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: Colors.DARK_GRAY,
  },
  takenButton: {
    backgroundColor: Colors.PRIMARY,
  },
  missedButton: {
    backgroundColor:'red',
  },
  disabledButton: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

