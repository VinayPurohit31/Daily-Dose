import { View, Text,TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors'; // Ensure this file exists and contains 'GRAY'
import { useRouter } from 'expo-router';
export default function SignUp() {
    const router=useRouter();
    return (
       <View style={{ padding: 25 }}>
                   
                   <Text style={styles.textHeader}>Create Account</Text>
                   <Text style={styles.subHeader}>Welcome To Daily-Dose</Text>
                   
       
                   <View style={{marginTop: 20}}>
                        <Text style={styles.textDisplay}>Your Name</Text>
                       <TextInput placeholder="Enter your Name" style={styles.input} />
                       <Text style={styles.textDisplay}>Email</Text>
                       <TextInput placeholder="Enter your Email" style={styles.input} />
                       <Text style={styles.textDisplay}>Password</Text>
                       <TextInput placeholder="Enter your Password" secureTextEntry={true} style={styles.input} />
                   </View>
       
                   <TouchableOpacity style={styles.buttonE}>
                       <Text style={styles.buttonTextL}>Create Account</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.buttonC}  onPress={()=>router.push('login/signin')}>
                       <Text style={styles.buttonTextCreateAcc}>Already have a account? Login</Text>
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
               alignContent: 'center',
               textAlign: 'center',
               // Ensure Colors.GRAY exists
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
           buttonE:{
               padding: 15,
               backgroundColor:Colors.PRIMARY, // Ensure Colors.PRIMARY exists
               borderRadius: 7,
               borderColor: 'black', // Ensure Colors.PRIMARY exists
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
               backgroundColor:'white',
               borderRadius: 7,
               marginTop: 15,
               alignItems: 'center',
               shadowColor: '#0084ff',
               shadowOffset: { width: 0, height: 5 },
               shadowOpacity: 0.5,
               shadowRadius: 10,
               elevation: 5,
               borderWidth: 1,
               borderColor: Colors.PRIMARY, // Ensure Colors.PRIMARY
           },
            buttonTextL: {
                   fontSize: 16,
                   color: 'white', // Ensure Colors is defined
                   fontWeight: 'bold',
               },
           buttonTextCreateAcc: {
                   fontSize: 16,
                   color:Colors.PRIMARY, // Ensure Colors is defined
                   fontWeight: 'bold',
           },
       
       });
       