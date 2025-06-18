import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

export default function AnimatedSplash({ onAnimationFinish }) {
    const shimmerValue = new Animated.Value(0);
    const logoOpacity = new Animated.Value(0);

    useEffect(() => {
        // Fade in logo
        Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Start shimmer animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),                Animated.timing(shimmerValue, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Trigger callback after animation
        setTimeout(onAnimationFinish, 4000);
    }, []);

    const shimmerTranslateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Animated.View style={{ opacity: logoOpacity }}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.shimmer,
                        {
                            transform: [{ translateX: shimmerTranslateX }],
                        },
                    ]}
                />
            </View>
            <Animated.Text style={[styles.title, { opacity: logoOpacity }]}>
                NutrIA
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 200,
        height: 200,
        overflow: 'hidden',
        position: 'relative',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        transform: [{ skewX: '-20deg' }],
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#2E7D32',
    },
});
