import React, { useState, useCallback } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  Platform,
  Alert,
  Modal,
  TextInput,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceRecognition } from '../utils/useVoiceRecognition';

const VoiceInput = ({ onVoiceResult, disabled = false }) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition();

  // Animação de pulso quando está gravando
  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  // Quando o transcript é atualizado, envia para o callback
  React.useEffect(() => {
    if (transcript && !isListening) {
      onVoiceResult(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onVoiceResult, resetTranscript]);

  // Mostra erro se houver
  React.useEffect(() => {
    if (error) {
      Alert.alert('Erro de Voz', error);
    }
  }, [error]);

  const handleVoicePress = useCallback(() => {
    if (disabled) return;

    if (Platform.OS === 'web' && isSupported) {
      // No web, usa reconhecimento de voz real
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } else {
      // No mobile, mostra input de texto alternativo
      setShowTextInput(true);
    }
  }, [disabled, isSupported, isListening, startListening, stopListening]);

  const handleManualSubmit = useCallback(() => {
    if (manualText.trim()) {
      onVoiceResult(manualText.trim());
      setManualText('');
      setShowTextInput(false);
    }
  }, [manualText, onVoiceResult]);

  const getIconName = () => {
    if (isListening) return 'mic';
    if (Platform.OS === 'web' && isSupported) return 'mic-outline';
    return 'mic-off-outline';
  };

  const getButtonColor = () => {
    if (isListening) return '#FF4444';
    if (Platform.OS === 'web' && isSupported) return '#2E8331';
    return '#999999';
  };

  return (
    <>
      <Animated.View style={[
        styles.container,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            { backgroundColor: getButtonColor() },
            disabled && styles.disabled
          ]}
          onPress={handleVoicePress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={getIconName()} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>Gravando...</Text>
          </View>
        )}
      </Animated.View>

      {/* Modal para input manual no mobile */}
      <Modal
        visible={showTextInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTextInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Digite sua mensagem
            </Text>
            <Text style={styles.modalSubtitle}>
              (Reconhecimento de voz não disponível no mobile)
            </Text>
            
            <TextInput
              style={styles.textInput}
              value={manualText}
              onChangeText={setManualText}
              placeholder="Digite sua pergunta aqui..."
              multiline
              numberOfLines={3}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setManualText('');
                  setShowTextInput(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={handleManualSubmit}
              >
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  voiceButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  listeningIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FF4444',
    borderRadius: 12,
  },
  listeningText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  sendButton: {
    backgroundColor: '#2E8331',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  sendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default VoiceInput; 