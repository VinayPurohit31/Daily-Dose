import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import the router

const SCREEN_WIDTH = Dimensions.get('window').width;

export function MedicationCardItem({ medicine, onDelete, selectedDate }) {
    const router = useRouter(); // Initialize the router

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

            {/* Reminder Section with Info Text */}
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
                            ...medicine, // Pass the entire medicine object
                            selectedDate: selectedDate // Pass the selected date
                        }
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
        width: '100%',
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
        padding: 2.9
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
        width: 94.9, // Match the width of the reminder pill
        height: 35, // Match the height of the reminder pill
        backgroundColor: Colors.PRIMARY, // Match the background color
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        borderRadius: 12, // Match the border radius
        marginTop: 10, // Add some margin at the top
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white', // Match the text color
    },
    deleteButton: {
        alignItems: 'center',
    },
});