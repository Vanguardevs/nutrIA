import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Inicializa o reconhecimento de voz apenas no web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        
        // Configurações
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.maxAlternatives = 1;

        // Event listeners
        recognitionInstance.onstart = () => {
          setIsListening(true);
          setError(null);
          setTranscript('');
        };

        recognitionInstance.onresult = (event) => {
          const result = event.results[0];
          if (result.isFinal) {
            const text = result[0].transcript;
            setTranscript(text);
            setIsListening(false);
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error('Erro no reconhecimento de voz:', event.error);
          setError(event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setError('Reconhecimento de voz não suportado neste navegador');
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (Platform.OS === 'web' && recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        setError('Erro ao iniciar reconhecimento de voz');
      }
    } else {
      setError('Reconhecimento de voz não disponível nesta plataforma');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (Platform.OS === 'web' && recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: Platform.OS === 'web' && recognition !== null
  };
}; 