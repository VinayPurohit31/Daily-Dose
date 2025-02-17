import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorage = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const getLocalStorage = async (key) => {
    const result = await AsyncStorage.getItem(key);
    return JSON.parse(result); // Use result instead of data
}

export const removeLocalStorage = async (key) => {
    await AsyncStorage.removeItem(key); // Use removeItem instead of clear for specific key
}
