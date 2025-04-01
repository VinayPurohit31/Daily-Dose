import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MedicationCardItemHistory = ({ medicine, onDelete, selectedDate, status }) => {
    const router = useRouter();

    const getStatusColor = () => {
        if (status.isFullyTaken) return Colors.SUCCESS;
        if (status.isFullyMissed) return Colors.ERROR;
        if (status.isPartiallyTaken) return Colors.WARNING;
        return Colors.GRAY;
    };

    const getStatusText = () => {
        if (status.isFullyTaken) return 'Completed';
        if (status.isFullyMissed) return 'All Missed';
        if (status.isPartiallyTaken) return 'In Progress';
        return 'Not Taken';
    };

    return (
        <View style={styles.container}>
            <View style={styles.subContainer} >
                <Image
                    source={{ uri: medicine?.type?.icon }}
                    style={styles.image}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.textName}>Med: {medicine.medName}</Text>
                    <Text style={styles.textName}>Illn: {medicine.illnessName}</Text>
                    <Text style={styles.textDose}>Dose: {medicine.dose}</Text>
                    <Text style={styles.textDose}>Tupe: {medicine.type.name}</Text>
                
                </View>
            </View>

            <View style={styles.reminderWrapper}>
                <View style={styles.reminderContainer}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        {medicine?.reminder?.map((time, index) => (
                            <View key={index} style={styles.reminderPill}>
                                <Text style={styles.reminderText}>{time}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="red" />
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: Colors.BACKGROUND,
        marginVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    textName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    textDose: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontWeight: '600',
        marginTop: 2,
    },
    reminderWrapper: {
        marginHorizontal: 10,
    },
    reminderContainer: {
        width: 90,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    reminderPill: {
        height: 30,
        paddingHorizontal: 10,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 3,
    },
    reminderText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'white',
    },
    deleteButton: {
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'red',
        fontSize: 10,
        fontWeight: '200',
    },
});

export default MedicationCardItemHistory ;