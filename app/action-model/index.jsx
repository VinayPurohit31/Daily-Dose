import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { db } from '../../config/FireBaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const STATUS = {
  PENDING: 'pending',
  TAKEN: 'taken',
  MISSED: 'missed'
};

export default function MedicationActionModel() {
  const medicine = useLocalSearchParams();
  const router = useRouter();

  // Safely parse reminders from params
  const reminders = useMemo(() => {
    try {
      // Handle both stringified array and direct array
      if (typeof medicine.reminders === 'string') {
        return JSON.parse(medicine.reminders || '[]');
      } else if (Array.isArray(medicine.reminders)) {
        return medicine.reminders;
      }
      return [];
    } catch (e) {
      console.error('Failed to parse reminders:', e);
      return [];
    }
  }, [medicine.reminders]);

  const [selectedTime, setSelectedTime] = useState(reminders[0] || '');
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reminders.length > 0 && !selectedTime) {
      setSelectedTime(reminders[0]);
    }
    fetchReminderStatus();
  }, [reminders]);

  const fetchReminderStatus = async () => {
    if (!medicine.medId || !medicine.selectedDate) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
      const docSnap = await getDoc(docRef);

      const initialStatus = {};
      reminders.forEach(time => {
        if (docSnap.exists() && docSnap.data()[time]) {
          initialStatus[time] = docSnap.data()[time];
        } else {
          initialStatus[time] = STATUS.PENDING;
        }
      });

      setStatusMap(initialStatus);
    } catch (error) {
      console.error("Error fetching reminder status:", error);
      Alert.alert("Error", "Failed to load medication status");

      // Initialize all as pending
      const initialStatus = {};
      reminders.forEach(time => {
        initialStatus[time] = STATUS.PENDING;
      });
      setStatusMap(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  const updateReminderStatus = async (status) => {
    if (!selectedTime || !medicine.medId || !medicine.selectedDate) return;

    try {
      setLoading(true);
      // Update local state
      setStatusMap(prev => ({
        ...prev,
        [selectedTime]: status
      }));

      // Update Firebase
      const docRef = doc(db, "medications", `${medicine.medId}_${medicine.selectedDate}`);
      await setDoc(docRef, {
        [selectedTime]: status,
        medId: medicine.medId,
        date: medicine.selectedDate,
        medName: medicine.medName,
        illnessName: medicine.illnessName,
        dose: medicine.dose,
        when: medicine.when
      }, { merge: true });
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update medication status");
    } finally {
      setLoading(false);
    }
  };

  const handleTaken = () => updateReminderStatus(STATUS.TAKEN);
  const handleMissed = () => updateReminderStatus(STATUS.MISSED);
  const handleCancel = () => updateReminderStatus(STATUS.PENDING);

  const handleBack = () => {
    router.back();
  };

  const getStatusIcon = (time) => {
    switch (statusMap[time]) {
      case STATUS.TAKEN: return '✔️';
      case STATUS.MISSED: return '❌';
      default: return '';
    }
  };

  const getButtonStyle = (buttonType) => {
    if (loading) return styles.disabledButton;
    if (!selectedTime) return styles.disabledButton;

    switch (buttonType) {
      case 'cancel':
        return statusMap[selectedTime] === STATUS.PENDING ? styles.disabledButton : styles.cancelButton;
      case 'missed':
        return statusMap[selectedTime] === STATUS.MISSED ? styles.disabledButton : styles.missedButton;
      case 'taken':
        return statusMap[selectedTime] === STATUS.TAKEN ? styles.disabledButton : styles.takenButton;
      default:
        return styles.disabledButton;
    }
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
          { label: 'Date', value: medicine?.selectedDate || 'N/A' },
          { label: 'Illness', value: medicine?.illnessName || 'N/A' },
          { label: 'Medication', value: medicine?.medName || 'N/A' },
          { label: 'When', value: medicine?.when || 'N/A' },
          { label: 'Dose', value: medicine?.dose || 'N/A' }
        ].map((item, index) => (
          <View style={styles.detailRow} key={index}>
            <Text style={styles.detailLabel}>{item.label}:</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.actionText}>Select Reminder Time</Text>
      <View style={styles.pickerContainer}>
        {loading && reminders.length === 0 ? (
          <ActivityIndicator size="small" color={Colors.PRIMARY} />
        ) : reminders.length > 0 ? (
          <Picker
            selectedValue={selectedTime}
            onValueChange={setSelectedTime}
            style={styles.picker}
            dropdownIconColor={Colors.PRIMARY}
            enabled={!loading}
          >
            {reminders.map((time, index) => (
              <Picker.Item
                key={index}
                label={`${time} ${getStatusIcon(time)}`}
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
          style={[styles.button, statusMap[selectedTime] === STATUS.PENDING ? styles.disabledButton : styles.cancelButton]}
          onPress={handleCancel}
          disabled={loading || !selectedTime || statusMap[selectedTime] === STATUS.PENDING}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, statusMap[selectedTime] === STATUS.MISSED ? styles.disabledButton : styles.missedButton]}
          onPress={handleMissed}
          disabled={loading || !selectedTime || statusMap[selectedTime] === STATUS.MISSED}
        >
          <Text style={styles.buttonText}>Missed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, statusMap[selectedTime] === STATUS.TAKEN ? styles.disabledButton : styles.takenButton]}
          onPress={handleTaken}
          disabled={loading || !selectedTime || statusMap[selectedTime] === STATUS.TAKEN}
        >
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
    backgroundColor: Colors.LIGHT_BACKGROUND
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: {
    padding: 10
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginLeft: 10
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  card: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.DARK
  },
  detailValue: {
    fontSize: 18,
    color: Colors.SECONDARY,
    fontWeight: '500'
  },
  actionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
    textAlign: 'center'
  },
  pickerContainer: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    elevation: 2,
    minHeight: 50,
    justifyContent: 'center'
  },
  picker: {
    height: 50
  },
  noReminderText: {
    fontSize: 18,
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 20
  },
  buttonContainer: {
    position: 'absolute',  
    bottom: 140,  
    left: 20,  
    right: 20,  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  cancelButton: {
    backgroundColor: Colors.DARK_GRAY,
  },
  
  takenButton: {
    backgroundColor: Colors.PRIMARY,
  },
  
  missedButton: {
    backgroundColor: Colors.ERROR,
  },
  
  disabledButton: {
    backgroundColor: '#d1d1d1',
    opacity: 0.6,
  },
  
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  

});