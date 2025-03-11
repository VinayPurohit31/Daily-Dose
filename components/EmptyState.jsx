import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import ConstantString from '../constant/ConstantString';
import Colors from '../constant/Colors';

const EmptyState = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/no-vaccines.png')} style={styles.image} />
            
            <Text style={styles.title}>{ConstantString.NoMedication}</Text>
            <Text style={styles.subtitle}>{ConstantString.MedicationSubText}</Text>
            
            <TouchableOpacity style={styles.button} onPress={() => router.push('add-new-medication')}>
                <Text style={styles.buttonText}>{ConstantString.AddNewMediciationBtn}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 180, 
        height: 180, 
        resizeMode: 'contain',
        marginTop:5,
        marginBottom:5
    },
    title: {
        fontSize: 24, 
        fontWeight: 'bold', 
        color: Colors.DARK_BLUE,
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.GRAY,
        textAlign: 'center',
        marginHorizontal: 20,
        lineHeight: 22,
    },
    button: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        backgroundColor: Colors.PRIMARY,
        shadowColor: '#0084ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
