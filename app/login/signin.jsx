import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        if (email === '' || password === '') {
            alert('Please fill all fields');
            return;
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Logged in:', user);
                alert('Login successful!');
                // Navigate to the home screen or dashboard
                router.replace('(tabs)');
            })
            .catch((error) => {
                console.log(error.code);
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
        <View style={{ padding: 25 }}>
            <Text style={styles.textHeader}>Let's Sign You In</Text>
            <Text style={styles.subHeader}>Welcome Back</Text>
            <Text style={styles.subHeader}>We Missed You!</Text>

            <View>
                <Text style={styles.textDisplay}>Email</Text>
                <TextInput
                    placeholder="Enter your Email"
                    style={styles.input}
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
    textHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    },
    subHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.GRAY,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 7,
        marginTop: 5,
    },
    textDisplay: {
        fontSize: 20,
        marginTop: 10,
        color: 'black',
    },
    buttonE: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 7,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#ff4b2b',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonC: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 7,
        marginTop: 15,
        alignItems: 'center',
        shadowColor: '#0084ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    buttonTextL: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonTextCreateAcc: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
});
