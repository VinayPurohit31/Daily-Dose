import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors'; // Ensure this file exists
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import { useRouter } from 'expo-router';

export default function LoginScreen() {

    const router=useRouter();
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('../../assets/images/login.png')} 
                    style={styles.image}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Stay on Track, Stay Healthy!</Text>
                <Text style={styles.subtitle}>
                    Track your meds, take them on time, and live a healthy life.
                </Text>

                <TouchableOpacity style={styles.button} onPress={()=>router.push('login/signin')}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <Text style={styles.tp}>Note: By Clicking continue button, you will agree to aur TC</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        marginTop: 35,
    },
    image: {
        width: 210,
        height: 450,
        borderRadius: 23,
    },
    content: {
        flex: 1,
        padding: 25,
        backgroundColor: Colors.PRIMARY, // Ensure Colors is defined
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    subtitle: {
        color: 'white',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 99,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: Colors.PRIMARY, // Ensure Colors is defined
        fontWeight: 'bold',
    },
    tp: {
        color: 'white',
        marginTop: 10,
        fontSize: 12,
    },
});
