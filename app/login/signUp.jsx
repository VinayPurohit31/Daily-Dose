import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { auth } from '../../config/FireBaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const onCreateAccount = () => {
        if (email === '' || password === '' || username === '') {
            alert('Please fill all the fields');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: username,
                });
                router.push('(tabs)');
                alert('Account Created Successfully!');
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('Email already in use');
                } else {
                    alert('Error: ' + error.message);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Create Account</Text>
            <Text style={styles.subHeader}>Welcome to Daily Dose!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.textDisplay}>Your Name</Text>
                <TextInput 
                    onChangeText={(value) => setUsername(value)} 
                    placeholder="Enter your Name" 
                    style={styles.input} 
                />
                <Text style={styles.textDisplay}>Email</Text>
                <TextInput
                    placeholder="Enter your Email"
                    style={styles.input}
                    keyboardType="email-address"
                    onChangeText={(value) => setEmail(value)}
                />
                <Text style={styles.textDisplay}>Password</Text>
                <TextInput
                    placeholder="Enter your Password"
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                />
            </View>

            <TouchableOpacity style={styles.buttonE} onPress={onCreateAccount}>
                <Text style={styles.buttonTextL}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonC} onPress={() => router.push('login/signin')}>
                <Text style={styles.buttonTextCreateAcc}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 25,
        justifyContent: 'center',
    },
    textHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        color: Colors.GRAY,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    textDisplay: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
        color: Colors.DARK_GRAY,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 10,
        marginTop: 5,
        fontSize: 16,
    },
    buttonE: {
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonTextL: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonC: {
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        backgroundColor: 'white',
        shadowColor: '#0084ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonTextCreateAcc: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
});
