import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import Colors from '../constant/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width; // Get screen width for dynamic sizing

export function MedicationCardItem({ medicine }) {
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
                <Text style={styles.reminderInfo}>Scroll for</Text>
                <Text style={styles.reminderInfo}>all reminders →</Text>
                <View style={styles.reminderContainer}>
                    <ScrollView 
                        horizontal={true} 
                        pagingEnabled={true} // ✅ Scrolls one reminder at a time
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
            </View>
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
        fontSize: 20,
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
    reminderInfo: {
        fontSize: 12,
        color: '#888',
        marginBottom: 3,
    },
    reminderContainer: {
        width: 120, // ✅ Fixed width to show only one reminder at a time
        height: 50, // ✅ Fixed height to keep pills inside
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden', // ✅ Prevents content from going out of border
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    scrollViewContent: {
        alignItems: 'center', // ✅ Centers the pills properly
        padding: 10
    },
    reminderPill: {
        width: 94.9, // ✅ Matches container width to fit one item
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
});
