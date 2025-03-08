import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Colors from '../constant/Colors';

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
                    <Text style={styles.textWhen}>Illness Name: {medicine?.illnessName}</Text>
                    <Text style={styles.textWhen}>{medicine?.when}</Text>
                    <Text style={styles.textDose}>{medicine?.dose} {medicine?.type?.name}</Text>
                </View>
            </View>

            {/* Scrollable Reminder Section */}
            <View style={styles.reminderContainer}>
                <ScrollView 
                    style={styles.scrollView} 
                    showsVerticalScrollIndicator={true} // ✅ Enable scrollbar
                    nestedScrollEnabled={true} // ✅ Allows scrolling inside a nested ScrollView
                >
                    {medicine?.reminder?.map((time, index) => (
                        <View key={index} style={styles.reminderPill}>
                            <Text style={styles.reminderText}>{time}</Text>
                        </View>
                    ))}
                </ScrollView>
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
    reminderContainer: {
        width: 120,
        maxHeight: 80, // ✅ Allows it to expand only when needed
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    scrollView: {
        flex: 1, // ✅ Enables scrolling inside the fixed-height container
    },
    reminderPill: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 5,
        alignItems: 'center',
    },
    reminderText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
    },
});
