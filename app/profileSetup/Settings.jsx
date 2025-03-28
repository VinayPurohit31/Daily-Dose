import { View, Text, Switch, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {/* Notifications Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>

            {/* Dark Mode Toggle */}
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 18,
    },
});
