import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function MedicationCardItem({ medicine, onDelete, selectedDate, status }) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image
                    source={{ uri: medicine?.type?.icon }}
                    style={styles.image}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.textName}>{medicine?.medName}</Text>
                    <Text style={styles.textWhen}>{medicine?.illnessName}</Text>
                    <Text style={styles.textWhen}>{medicine?.when}</Text>
                    <Text style={styles.textDose}>{medicine?.dose} {medicine?.type?.name}</Text>
                </View>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    {status.isFullyTaken ? 'Completed' : status.isPartiallyTaken ? 'In Progress' : 'Not Taken'}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${status.takenPercentage}%` },
                        ]}
                    />
                </View>
            </View>

            {/* Reminder Section */}
            <View style={styles.reminderWrapper}>
                <View style={styles.reminderContainer}>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        {medicine?.reminder?.map((time, index) => (
                            <View key={index} style={styles.reminderPill}>
                                <Text style={styles.reminderText}>{time}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Button to navigate to the action model */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push({
                        pathname: 'action-model',
                        params: {
                            ...medicine,
                            selectedDate: selectedDate,
                            reminders: JSON.stringify(medicine.reminder),
                        },
                    })}
                >
                    <Text style={styles.actionButtonText}>Take Med</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Button */}
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="red" />
                <Text style={{ color: 'red', fontSize: 10, fontWeight: '200' }}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: Colors.BACKGROUND,
        marginVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '99%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
    },
    textName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    textWhen: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    textDose: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontWeight: '600',
        marginTop: 2,
    },
    statusContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.PRIMARY,
    },
    progressBar: {
        width: 100,
        height: 8,
        backgroundColor: Colors.LIGHT_GRAY_BORDER,
        borderRadius: 4,
        marginTop: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.PRIMARY,
        borderRadius: 4,
    },
    reminderWrapper: {
        alignItems: 'center',
    },
    reminderContainer: {
        width: 110,
        height: 41,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    scrollViewContent: {
        alignItems: 'flex-start',
        padding: 2.9,
    },
    reminderPill: {
        width: 94.9,
        height: 35,
        marginHorizontal: 5,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    reminderText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
    },
    actionButton: {
        width: 94.9,
        height: 35,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 10,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
    },
    deleteButton: {
        alignItems: 'center',
    },
});