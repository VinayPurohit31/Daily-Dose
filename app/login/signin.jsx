import { View, Text} from 'react-native'
import React from 'react'
import{StyleSheet} from 'react-native'
import Colors from '../../constant/Colors'


export default function SignInScreen() {
    return (
        <View style={{
            padding: 25,
        }}>
            <Text style={styles.testHeader}>Let's Sign You In</Text>
            <Text style={styles.subHeader}>Welcome Back</Text>
            <Text style={styles.subHeader}>We Missed You!</Text>
           
        </View>
    )
}

const styles = StyleSheet.create({
    testHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    },
    subHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold',
        color:Colors.GRAY,
       
    },
})
