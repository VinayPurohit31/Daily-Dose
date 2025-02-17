import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/FireBaseConfig'; // ✅ Correct import
import { setLocalStorage } from '../../service/Storage';

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        if (email === '' || password === '') {
            alert('Please fill all fields');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user; // Get user from the userCredential
                console.log('Logged in:', user);

                await setLocalStorage('userDetail', user); // Store the actual user object
                alert('Login successful!');
                router.replace('(tabs)');
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    alert('User not found. Please check your email.');
                } else if (error.code === 'auth/wrong-password') {
                    alert('Incorrect password. Try again.');
                } else {
                    alert('Error: ' + error.message);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Let's Sign You In</Text>
            <Text style={styles.subHeader}>Welcome Back! We Missed You</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.textDisplay}>Email</Text>
                <TextInput
                    placeholder="Enter your Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                />
                <Text style={styles.textDisplay}>Password</Text>
                <TextInput
                    placeholder="Enter your Password"
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                />
            </View>

            <TouchableOpacity style={styles.buttonE} onPress={onLogin}>
                <Text style={styles.buttonTextL}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonC} onPress={() => router.push('login/signUp')}>
                <Text style={styles.buttonTextCreateAcc}>Create Account</Text>
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
