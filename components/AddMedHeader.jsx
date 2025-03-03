import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
export default function AddMedHeader() {
  const router = useRouter();

  return (
    <View>
      <Image source={require('../assets/images/Dr.png')} style={styles.image} />

      <TouchableOpacity style={styles.tob} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
  },
  tob: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
  },

});
