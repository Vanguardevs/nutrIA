import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomMessageCamp({ value, onChangeText, onSend }) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder="Digite sua mensagem"
            />
            <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="green" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 8,
        elevation: 2,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginRight: 8,
        fontSize: 16,
    },
    sendButton: {
        padding: 6,
    },
});