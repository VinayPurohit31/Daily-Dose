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
            <View style={styles.content} id='12'>
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
        marginTop: 1,
        padding: 20,

    },
    image: {
        width: 210,
        height: 450,
        borderRadius: 23,
    },
    content: {
        flex: 1,
        padding: 25,
        backgroundColor: Colors.PRIMARY, 
        borderTopLeftRadius: 20,  // Added curve on the top left corner
        borderTopRightRadius: 20, // Added curve on the top right corner
        justifyContent: 'center', // Moved up by 30 units
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
        borderRadius: 7,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        shadowColor: '#0084ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
               
    },
    buttonText: {
        fontSize: 16,
        color: Colors.PRIMARY, // Ensure Colors is defined
        fontWeight: 'bold',
    },
    tp: {
        color: 'white',
        marginTop: 10,
        fontSize: 15,
        textAlign: 'center',
    },
});
