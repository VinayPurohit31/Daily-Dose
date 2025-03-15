import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ConstantString from '../constant/ConstantString';
import Colors from '../constant/Colors';
import { TypeList, WhenToTake } from '../constant/Options';
import { convertToTime, formatDateForText, getDatesRange } from '../service/ConvertDateTime';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';
import { getLocalStorage } from '../service/Storage';
import { useRouter } from 'expo-router';

export default function AddMedForm() {
    const [formData, setFormData] = useState({ reminder: [], illnessName: '' });
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [illnessList, setIllnessList] = useState([]);
    const [showIllnessInput, setShowIllnessInput] = useState(false); // State to toggle between Picker and TextInput
    const router = useRouter();

    useEffect(() => {
        const fetchIllnesses = async () => {
            const querySnapshot = await getDocs(collection(db, 'illnesses'));
            setIllnessList(querySnapshot.docs.map(doc => doc.id));
        };
        fetchIllnesses();
    }, []);

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addReminderTime = (selectedTime) => {
        if (selectedTime) {
            setFormData(prev => ({
                ...prev,
                reminder: [...prev.reminder, convertToTime(selectedTime)]
            }));
        }
    };

    const removeReminderTime = (index) => {
        setFormData(prev => ({
            ...prev,
            reminder: prev.reminder.filter((_, i) => i !== index)
        }));
    };

    const SaveMedication = async () => {
        const docId = Date.now().toString();
        const user = await getLocalStorage('userDetail');

        if (!(formData?.illnessName && formData?.medName && formData?.type && formData?.dose && formData?.startDate && formData?.endDate && formData?.reminder.length)) {
            Alert.alert("Missing Fields", "Please fill in all the required fields.");
            return;
        }

        const dates = getDatesRange(formData?.startDate, formData.endDate);
        setLoading(true);

        try {
            await setDoc(doc(db, 'medication', docId), {
                ...formData,
                userEmail: user?.email,
                docId: docId,
                dates: dates
            });

            if (!illnessList.includes(formData.illnessName)) {
                await setDoc(doc(db, 'illnesses', formData.illnessName), {});
            }

            setLoading(false);
            Alert.alert("Success", "Medication added successfully!", [
                { text: 'Ok', onPress: () => router.push('(tabs)') }
            ]);
        } catch (e) {
            setLoading(false);
            console.log(e);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{ConstantString.AddNewMediciation}</Text>

            {/* Illness Name */}
            <View style={styles.input}>
                <MaterialCommunityIcons style={styles.icon} name="virus-outline" size={24} color="black" />
                {showIllnessInput ? (
                    // Show TextInput if user wants to enter a new illness
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter Illness Name"
                        value={formData.illnessName}
                        onChangeText={(value) => onHandleInputChange('illnessName', value)}
                    />
                ) : (
                    // Show Picker if user wants to select an existing illness
                    <Picker
                        selectedValue={formData.illnessName}
                        onValueChange={(value) => {
                            if (value === "new") {
                                // If "Enter New Illness" is selected, show the TextInput
                                setShowIllnessInput(true);
                                onHandleInputChange('illnessName', '');
                            } else {
                                onHandleInputChange('illnessName', value);
                            }
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Illness or Enter New" value="" />
                        {illnessList.map((illness, index) => (
                            <Picker.Item key={index} label={illness} value={illness} />
                        ))}
                        <Picker.Item label="Enter New Illness" value="new" />
                    </Picker>
                )}
            </View>

            {/* Medication Name */}
            <View style={styles.input}>
                <AntDesign style={styles.icon} name="medicinebox" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Medication Name"
                    onChangeText={(value) => onHandleInputChange('medName', value)}
                />
            </View>

            {/* Type Selection */}
            <FlatList
                data={TypeList}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.typeListContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onHandleInputChange('type', item)}
                        style={[
                            styles.inputGroupStyle,
                            { backgroundColor: formData?.type === item ? Colors.PRIMARY : 'white' }
                        ]}
                    >
                        <Text style={[styles.typeText, { color: formData?.type === item ? 'white' : 'black' }]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Dosage Input */}
            <View style={styles.input}>
                <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Dose (e.g., 2 pills, 5ml)"
                    onChangeText={(value) => onHandleInputChange('dose', value)}
                />
            </View>

            {/* When to Take */}
            <View style={styles.input}>
                <Feather style={styles.icon} name="clock" size={24} color="black" />
                <Picker
                    selectedValue={formData.when}
                    onValueChange={(itemValue) => onHandleInputChange('when', itemValue)}
                    style={styles.picker}
                >
                    {WhenToTake.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>

            {/* Start & End Date */}
            <View style={styles.dateGroup}>
                {/* Start Date */}
                <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowStartDate(true)}>
                    <MaterialIcons style={styles.icon} name="date-range" size={24} color="black" />
                    <Text style={styles.inputDate}>
                        {formData?.startDate ? formatDateForText(formData.startDate) : 'Start Date'}
                    </Text>
                </TouchableOpacity>

                {showStartDate && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        mode="date"
                        onChange={(event, selectedDate) => {
                            setShowStartDate(false);
                            if (selectedDate) {
                                onHandleInputChange('startDate', selectedDate.toISOString());
                            }
                        }}
                        value={formData?.startDate ? new Date(formData.startDate) : new Date()}
                    />
                )}

                {/* End Date */}
                <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowEndDate(true)}>
                    <MaterialIcons style={styles.icon} name="date-range" size={24} color="black" />
                    <Text style={styles.inputDate}>
                        {formData?.endDate ? formatDateForText(formData.endDate) : 'End Date'}
                    </Text>
                </TouchableOpacity>

                {showEndDate && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        mode="date"
                        onChange={(event, selectedDate) => {
                            setShowEndDate(false);
                            if (selectedDate) {
                                onHandleInputChange('endDate', selectedDate.toISOString());
                            }
                        }}
                        value={formData?.endDate ? new Date(formData.endDate) : new Date()}
                    />
                )}
            </View>

            {/* Reminder Times */}
            <Text style={styles.subHeader}>Reminder Times</Text>
            <View>
                {formData.reminder.map((time, index) => (
                    <View key={index} style={styles.reminderRow}>
                        <Text style={styles.reminderText}>{time}</Text>
                        <TouchableOpacity onPress={() => removeReminderTime(index)}>
                            <MaterialIcons name="cancel" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Entypo style={styles.icon} name="stopwatch" size={24} color="black" />
                <Text style={styles.buttonText}>+ Add Reminder</Text>
            </TouchableOpacity>

            {showTimePicker && (
                <RNDateTimePicker
                    mode="time"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        addReminderTime(selectedTime);
                    }}
                    value={new Date()}
                />
            )}

            {/* Save Button */}
            <TouchableOpacity style={styles.buttonE} onPress={SaveMedication} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <Text style={styles.buttonTextL}>Add Medication</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GRAY,
        marginBottom: 20,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        color: Colors.PRIMARY,
        marginRight: 10,
        borderRightWidth: 1,
        paddingRight: 15,
        borderColor: Colors.GRAY,
    },
    picker: {
        flex: 1,
        height: 56,
    },
    typeListContainer: {
        paddingVertical: 10,
        marginBottom: 20,
    },
    inputGroupStyle: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GRAY,
        marginRight: 8,
    },
    typeText: {
        fontSize: 14,
    },
    inputDate: {
        fontSize: 13,
        padding: 5,
        flex: 1,
        marginLeft: 10,
    },
    dateGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    buttonE: {
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonTextL: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    reminderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: Colors.DARK_GRAY,
    },
    reminderText: {
        fontSize: 16,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
});