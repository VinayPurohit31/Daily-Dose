import { View, Text, Switch, StyleSheet, Appearance } from 'react-native';
import React, { useState, useEffect } from 'react';

// Define your color scheme
const lightColors = {
    background: '#f4f4f4',
    text: '#333',
    cardBackground: '#fff',
    border: '#ddd',
    primary: '#007AFF',
};

const darkColors = {
    background: '#121212',
    text: '#f4f4f4',
    cardBackground: '#1e1e1e',
    border: '#333',
    primary: '#0A84FF',
};

export default function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');
    const [colors, setColors] = useState(darkMode ? darkColors : lightColors);

    useEffect(() => {
        setColors(darkMode ? darkColors : lightColors);
    }, [darkMode]);

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {/* Notifications Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch 
                    value={notificationsEnabled} 
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                />
            </View>

            {/* Dark Mode Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch 
                    value={darkMode} 
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
                />
            </View>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.text,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.cardBackground,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    settingText: {
        fontSize: 18,
        color: colors.text,
    },
});