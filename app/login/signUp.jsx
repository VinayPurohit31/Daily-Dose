import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { auth } from '../../config/FireBaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[username,setUsername]=useState('');

    const onCreateAccount = () => {
        if (email === '' || password === '' || username === '') {
            alert('Please fill all the fields');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: username,
                });
                router.push('(tabs)');
                alert('Account Created Successfully!');
                
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    alert('Email already in use');
                } else {
                    alert('Error: ' + error.message);
                }
            });
    };

    return (
        <View style={{ padding: 25 }}>
            <Text style={styles.textHeader}>Create Account</Text>
            <Text style={styles.subHeader}>Welcome To Daily-Dose</Text>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.textDisplay}>Your Name</Text>
                <TextInput onChangeText={(value)=>setUsername(value)} placeholder="Enter your Name" style={styles.input} />
                <Text style={styles.textDisplay}>Email</Text>
                <TextInput
                    placeholder="Enter your Email"
                    style={styles.input}
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
    textHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    subHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.GRAY,
        textAlign: 'center',
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
