import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
    iconBgColor?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    primaryButtonColor?: string;
    secondaryButtonColor?: string;
    showButtons?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    title,
    message,
    icon = "information-circle",
    iconColor = "#007AFF",
    iconBgColor = "#E3F2FD",
    primaryButtonText = "OK",
    secondaryButtonText = "Cancelar",
    onPrimaryPress,
    onSecondaryPress,
    primaryButtonColor = "#2E8331",
    secondaryButtonColor = "#FF3B30",
    showButtons = true
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible, scaleAnim, opacityAnim]);

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        } else {
            onClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        } else {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
                <Animated.View 
                    style={[
                        styles.modalContent,
                        { 
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <View style={[styles.modalIconContainer, { backgroundColor: iconBgColor }]}>
                            <Ionicons name={icon as any} size={32} color={iconColor} />
                        </View>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.modalMessage}>{message}</Text>
                    </View>
                    
                    {showButtons && (
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton, 
                                    styles.secondaryButton,
                                    { backgroundColor: secondaryButtonColor }
                                ]}
                                onPress={handleSecondaryPress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.modalButton, 
                                    styles.primaryButton,
                                    { backgroundColor: primaryButtonColor }
                                ]}
                                onPress={handlePrimaryPress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIconContainer: {
        borderRadius: 16,
        padding: 8,
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1C1C1E',
        textAlign: 'center',
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    primaryButton: {
        backgroundColor: '#2E8331',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: '#FF3B30',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default CustomModal; 