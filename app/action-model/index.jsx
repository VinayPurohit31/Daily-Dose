import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function MedicationActionModel() {
    const medicine = useLocalSearchParams();
    const router = useRouter();

    // Parse reminders from navigation params and memoize
    const reminders = useMemo(() => JSON.parse(medicine.reminders || '[]'), [medicine.reminders]);

    const [selectedTime, setSelectedTime] = useState('');
    const [reminderTimes, setReminderTimes] = useState([]);

    useEffect(() => {
        console.log("useEffect triggered");
        if (reminders && Array.isArray(reminders)) {
            console.log("Setting reminder times:", reminders);
            setReminderTimes(reminders);
            setSelectedTime(reminders.length > 0 ? reminders[0] : '');
        }
    }, [reminders]); // Only run when `reminders` changes

    const handleCancel = () => {
        console.log('Cancel button pressed');
    };

    const handleTaken = () => {
        console.log(`Taken button pressed at ${selectedTime}`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            <Image source={require('./../../assets/images/notification.gif')} style={styles.image} />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Medication Details</Text>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{medicine?.selectedDate}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Illness:</Text><Text style={styles.detailValue}>{medicine?.illnessName}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Medication:</Text><Text style={styles.detailValue}>{medicine?.medName}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>When:</Text><Text style={styles.detailValue}>{medicine?.when}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Dose:</Text><Text style={styles.detailValue}>{medicine?.dose} {medicine?.type?.name}</Text></View>
            </View>

            <Text style={styles.actionText}>Select Reminder Time</Text>
            {reminderTimes.length > 0 ? (
                <Picker
                    selectedValue={selectedTime}
                    onValueChange={(itemValue) => setSelectedTime(itemValue)}
                    style={styles.picker}
                >
                    {reminderTimes.map((time, index) => (
                        <Picker.Item key={index} label={time} value={time} />
                    ))}
                </Picker>
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
    container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.LIGHT_BACKGROUND },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
    image: { width: 120, height: 120, marginBottom: 20 },
    card: { width: '100%', backgroundColor: Colors.WHITE, borderRadius: 10, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 15, textAlign: 'center' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    detailLabel: { fontSize: 16, color: Colors.DARK, fontWeight: '500' },
    detailValue: { fontSize: 16, color: Colors.SECONDARY, fontWeight: '400' },
    actionText: { fontSize: 20, fontWeight: 'bold', color: Colors.PRIMARY, marginBottom: 10, textAlign: 'center' },
    picker: { width: '100%', backgroundColor: Colors.WHITE, marginBottom: 20 },
    noReminderText: { fontSize: 16, color: Colors.GRAY, textAlign: 'center', marginBottom: 20 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
    button: { flex: 1, paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
    cancelButton: { backgroundColor: Colors.GRAY },
    takenButton: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE, fontSize: 16, fontWeight: 'bold' },
});