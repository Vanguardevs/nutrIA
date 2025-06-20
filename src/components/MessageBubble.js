import React, { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isUser }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [message]);

    return (
        <Animated.View
            style={[
                styles.bubble,
                isUser ? styles.user : styles.bot,
                { opacity: fadeAnim }
            ]}
        >
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        marginVertical: 6,
        marginHorizontal: 12,
        padding: 12,
        borderRadius: 16,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        elevation: 2,
    },
    user: {
        backgroundColor: '#e0ffe0',
        alignSelf: 'flex-end',
    },
    bot: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 16,
        color: '#222',
    },
});