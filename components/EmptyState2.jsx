import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import ConstantString from '../constant/ConstantString';
import Colors from '../constant/Colors';

export default function EmptyState2() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={require('../assets/images/no-drugs(1).png')} style={styles.image} />
                <Text style={styles.title}>{ConstantString.AddNewMediciation}</Text>
                <Text style={styles.subtitle}>{ConstantString.MedicationSubText2}</Text>

                <TouchableOpacity style={styles.button} onPress={() => router.push('add-new-medication')}>
                    <Text style={styles.buttonText}>{ConstantString.AddNewMediciationBtn}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.DARK_BLUE,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.GRAY,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
