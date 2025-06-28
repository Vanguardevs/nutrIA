# Configuração do Google Maps

## Pré-requisitos

Para usar o Google Maps no seu aplicativo React Native, você precisa configurar as chaves de API do Google.

### 1. Obter Chave da API do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (opcional, para busca de lugares)
   - Geocoding API (opcional, para conversão de endereços)

### 2. Configurar Chaves de API

#### Para Android:
1. No Google Cloud Console, vá para "Credenciais"
2. Crie uma nova chave de API
3. Restrinja a chave para Android apps
4. Adicione o SHA-1 fingerprint do seu projeto

#### Para iOS:
1. Crie uma nova chave de API
2. Restrinja a chave para iOS apps
3. Adicione o Bundle ID do seu aplicativo

### 3. Configurar no Projeto

#### Android (app.json):
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "SUA_CHAVE_API_AQUI"
        }
      }
    }
  }
}
```

#### iOS (app.json):
```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "SUA_CHAVE_API_AQUI"
      }
    }
  }
}
```

### 4. Configuração Completa do app.json

```json
{
  "expo": {
    "name": "nutrIA",
    "slug": "nutria-kpg7uvvwaun8w72c5wvm",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "config": {
        "googleMapsApiKey": "SUA_CHAVE_API_IOS_AQUI"
      },
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Precisamos do microfone para reconhecimento de voz.",
        "NSLocationWhenInUseUsageDescription": "Precisamos da sua localização para mostrar clínicas próximas.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "Precisamos da sua localização para mostrar clínicas próximas."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.vanguardnutria.softwareAssistant",
      "newArchEnabled": true,
      "config": {
        "googleMaps": {
          "apiKey": "SUA_CHAVE_API_ANDROID_AQUI"
        }
      },
      "permissions": [
        "RECORD_AUDIO",
        "INTERNET",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "e02f7476-de94-4d3f-b571-f429ee9c38c0"
      }
    },
    "owner": "vanguard-nutria"
  }
}
```

### 5. Obter SHA-1 Fingerprint (Android)

Para obter o SHA-1 fingerprint do seu projeto:

```bash
# Para desenvolvimento
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Para produção (se você tiver um keystore personalizado)
keytool -list -v -keystore seu-keystore.jks -alias seu-alias
```

### 6. Bundle ID (iOS)

O Bundle ID é o identificador único do seu aplicativo iOS. No nosso caso, seria algo como:
`com.vanguardnutria.softwareAssistant`

### 7. Testando

Após configurar as chaves:

1. Execute `expo prebuild` para gerar os arquivos nativos
2. Execute `expo run:android` ou `expo run:ios`
3. Teste a funcionalidade do mapa

### 8. Troubleshooting

#### Erro: "Google Maps API key not found"
- Verifique se a chave está corretamente configurada no app.json
- Certifique-se de que a API está ativada no Google Cloud Console
- Verifique se as restrições da chave estão corretas

#### Erro: "Location permission denied"
- Verifique se as permissões estão configuradas no app.json
- Teste em um dispositivo físico (localização pode não funcionar no emulador)

#### Mapa não carrega
- Verifique a conexão com a internet
- Certifique-se de que a chave da API tem as APIs corretas ativadas
- Verifique se há restrições de IP na chave da API

### 9. Segurança

⚠️ **Importante**: Nunca commite suas chaves de API no controle de versão!

Use variáveis de ambiente:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "${GOOGLE_MAPS_API_KEY_ANDROID}"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "${GOOGLE_MAPS_API_KEY_IOS}"
      }
    }
  }
}
```

E configure as variáveis de ambiente no seu sistema de CI/CD ou localmente. 