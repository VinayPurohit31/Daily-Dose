import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker'; // Correct import
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import ConstantString from '../constant/ConstantString';
import Colors from '../constant/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TypeList, WhenToTake } from '../constant/Options';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function AddMedForm() {
    const [formData, setFormData] = useState({});
    const [showStartDate,setStartDate]=useState(false);

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{ConstantString.AddNewMediciation}</Text>

            {/* Medication Name Input */}
            <View style={styles.input}>
                <AntDesign style={styles.icon} name="medicinebox" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Medication Name"
                    onChangeText={(value) => onHandleInputChange('name', value)}
                />
            </View>

            {/* Type List */}
            <FlatList
                data={TypeList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.name}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.typeListContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onHandleInputChange('type', item.name)}
                        style={[
                            styles.inputGroupStyle,
                            { backgroundColor: formData?.type === item.name ? Colors.PRIMARY : Colors.WHITE }
                        ]}
                    >
                        <Text style={[styles.typeText, { color: formData?.type === item.name ? 'white' : 'black' }]}>
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
                    placeholder="Dose (e.g., 2, 5ml)"
                    onChangeText={(value) => onHandleInputChange('dose', value)}
                />
            </View>

            {/* When to Take DropDown */}
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

            {/* Start and End Date */}
            <View style={styles.dateGroup}>
                <TouchableOpacity style={[styles.input,{flex:1}]} onPress={()=>setStartDate(true)}>
                    <MaterialIcons style={styles.icon} name="date-range" size={24} color="black" />
                    <Text style={styles.inputDate}>
                        {formData?.startDate ?? 'Start Date'}
                    </Text>
                    
                </TouchableOpacity>
                {showStartDate&&<RNDateTimePicker
                    minimumDate={new Date()}
                    onChange={(event)=>{console.log(event.nativeEvent.timestamp);
                        setShowStartDate(false)
                    }}
                    value={formData.startDate??new Date()}
                    />}

                <View style={[styles.input,{flex:1}]}>
                    <MaterialIcons style={styles.icon} name="date-range" size={24} color="black" />
                    <Text style={styles.inputDate}>
                        {formData?.endDate ?? 'End Date'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    picker: {
        flex: 1,
        height: 56,
    },
    inputDate: {
        fontSize: 16,
        padding: 5,
        flex: 1,
        marginLeft: 10

    },
    dateGroup: {
        flexDirection: 'row',
        gap: 10,
    }
});
