import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '../constant/Colors';

export function MedicationCardItem({ medicine }) {
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image 
                    source={{ uri: medicine?.type?.icon }} 
                    style={styles.image} 
                />
                <View>
                    <Text style={styles.textName}>{medicine?.name}</Text>
                    <Text style={styles.textWhen}>{medicine?.when}</Text>
                    <Text style={styles.textDose}>{medicine?.dose} {medicine?.type?.name}</Text>
                </View>
            </View>
            <View style={styles.reminderContainer}>
                <FontAwesome5 name="clock" size={24} color="black" />
                <Text>{medicine?.reminder}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: Colors.LIGHT_PRIMARY,
        marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
    },
    textName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    textWhen: {
        fontSize: 14,
    },
    textDose: {
        color: 'black',
    },
    reminderContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
    },
});
