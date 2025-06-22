import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  showIcon = true,
  buttons = [],
}) => {
  const colorScheme = useColorScheme();
  
  const colors = {
    background: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
    card: colorScheme === 'dark' ? '#2C2C2E' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1E',
    textSecondary: colorScheme === 'dark' ? '#8E8E93' : '#6C757D',
    border: colorScheme === 'dark' ? '#38383A' : '#E9ECEF',
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          iconColor: '#28A745',
          backgroundColor: '#D4EDDA',
          borderColor: '#C3E6CB',
        };
      case 'error':
        return {
          icon: 'close-circle',
          iconColor: '#DC3545',
          backgroundColor: '#F8D7DA',
          borderColor: '#F5C6CB',
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: '#FFC107',
          backgroundColor: '#FFF3CD',
          borderColor: '#FFEAA7',
        };
      default:
        return {
          icon: 'information-circle',
          iconColor: '#17A2B8',
          backgroundColor: '#D1ECF1',
          borderColor: '#BEE5EB',
        };
    }
  };

  const typeConfig = getTypeConfig();

  const defaultButtons = buttons.length > 0 ? buttons : [
    {
      text: 'OK',
      onPress: onClose,
      style: 'primary',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header com ícone */}
          {showIcon && (
            <View style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}>
              <Ionicons 
                name={typeConfig.icon} 
                size={48} 
                color={typeConfig.iconColor} 
              />
            </View>
          )}

          {/* Conteúdo */}
          <View style={styles.content}>
            {title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            )}
            
            {message && (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {message.split('\n').map((line, index) => (
                  <Text key={index}>
                    {line}
                    {index < message.split('\n').length - 1 && '\n'}
                  </Text>
                ))}
              </Text>
            )}
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {defaultButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'secondary' && styles.buttonSecondary,
                  button.style === 'danger' && styles.buttonDanger,
                  { borderColor: colors.border }
                ]}
                onPress={button.onPress}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'secondary' && styles.buttonTextSecondary,
                  button.style === 'danger' && styles.buttonTextDanger,
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E8331',
    borderWidth: 1,
    borderColor: '#2E8331',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#6C757D',
  },
  buttonDanger: {
    backgroundColor: '#DC3545',
    borderColor: '#DC3545',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#6C757D',
  },
  buttonTextDanger: {
    color: '#FFFFFF',
  },
});

export default CustomModal; 