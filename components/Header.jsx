import { View, Image, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getLocalStorage } from '../service/Storage';

export default function Header() {
  const [user, setUser] = useState(null); // Initialize as null

  useEffect(() => {
    GetUserDetail();
  }, []);

  const GetUserDetail = async () => {
    const userInfo = await getLocalStorage('userDetail');
    console.log('User Info:', userInfo); // Check the structure of the stored object
    setUser(userInfo); // Set the user state to the retrieved value
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/groundhog.png')} style={styles.image} />
      <Text style={styles.label}>Wellcome to Daily-Dose {user?.displayName || 'Guest'}  </Text> {/* Show 'Guest' if user.displayName is undefined */}
      <Image source={require('../assets/images/syringe.png')} style={styles.image} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
