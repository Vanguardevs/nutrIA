# Configuração de Variáveis de Ambiente

## Visão Geral

Para usar a API de clínicas com dados reais, você precisa configurar as chaves de API do Google. Este arquivo mostra como configurar as variáveis de ambiente.

## Variáveis Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Google Places API Key (para buscar clínicas)
GOOGLE_PLACES_API_KEY=sua_chave_google_places_aqui

# Google Maps API Key (Android)
GOOGLE_MAPS_API_KEY_ANDROID=sua_chave_google_maps_android_aqui

# Google Maps API Key (iOS)
GOOGLE_MAPS_API_KEY_IOS=sua_chave_google_maps_ios_aqui

# Configurações do App
APP_ENV=development
API_BASE_URL=https://maps.googleapis.com/maps/api
```

## Como Obter as Chaves

### 1. Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API

### 2. Criar Chaves de API
1. Vá para "Credenciais" no menu lateral
2. Clique em "Criar Credenciais" > "Chave de API"
3. Crie chaves separadas para:
   - Google Places API
   - Google Maps (Android)
   - Google Maps (iOS)

### 3. Configurar Restrições
Para cada chave, configure as restrições:

#### Google Places API
- **Restrição de aplicativo**: Aplicativos da Web
- **Domínios autorizados**: Seu domínio (se aplicável)

#### Google Maps Android
- **Restrição de aplicativo**: Aplicativos Android
- **SHA-1 fingerprint**: Seu fingerprint do projeto
- **Nome do pacote**: `com.vanguardnutria.softwareAssistant`

#### Google Maps iOS
- **Restrição de aplicativo**: Aplicativos iOS
- **Bundle ID**: `com.vanguardnutria.softwareAssistant`

## Configuração no Projeto

### 1. Instalar dotenv (se necessário)
```bash
npm install dotenv
```

### 2. Configurar no app.json
O arquivo `app.json` já está configurado para usar as variáveis de ambiente:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "${GOOGLE_MAPS_API_KEY_IOS}"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "${GOOGLE_MAPS_API_KEY_ANDROID}"
        }
      }
    }
  }
}
```

### 3. Configurar no código
O arquivo `src/config/apiKeys.js` já está configurado para usar as variáveis:

```javascript
export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'SUA_CHAVE_API_GOOGLE_PLACES_AQUI';
```

## Segurança

### ⚠️ IMPORTANTE
- **NUNCA** commite o arquivo `.env` no controle de versão
- **NUNCA** compartilhe suas chaves de API
- Use restrições adequadas nas chaves
- Monitore o uso das APIs

### .gitignore
Certifique-se de que o arquivo `.env` está no `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

## Testando a Configuração

### 1. Verificar se as chaves estão configuradas
```javascript
import { validateApiKeys } from '../config/apiKeys';

const validation = validateApiKeys();
if (validation.isValid) {
  console.log('✅ Chaves configuradas corretamente');
} else {
  console.log('❌ Chaves faltando:', validation.missingKeys);
}
```

### 2. Testar a API
```javascript
import { searchNearbyClinics } from '../utils/clinicsAPI';

try {
  const clinics = await searchNearbyClinics(-23.5505, -46.6333);
  console.log('✅ API funcionando:', clinics.length, 'clínicas encontradas');
} catch (error) {
  console.log('❌ Erro na API:', error.message);
}
```

## Troubleshooting

### Erro: "Chaves de API não configuradas"
1. Verifique se o arquivo `.env` existe
2. Confirme se as variáveis estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro: "API key not valid"
1. Verifique se a chave está correta
2. Confirme se as APIs estão ativadas
3. Verifique as restrições da chave

### Erro: "Quota exceeded"
1. Verifique o uso no Google Cloud Console
2. Considere aumentar os limites
3. Implemente cache para reduzir requisições

## Limites e Custos

### Google Places API (Gratuito)
- 1000 requisições por dia
- $0.017 por 1000 requisições adicionais

### Google Maps API (Gratuito)
- $2 por 1000 carregamentos de mapa
- $5 por 1000 requisições de geocoding

### Recomendações
- Implemente cache local
- Use dados de fallback quando possível
- Monitore o uso regularmente

## Exemplo Completo

### .env
```bash
GOOGLE_PLACES_API_KEY=AIzaSyC_exemplo_places_key_aqui
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyC_exemplo_maps_android_key_aqui
GOOGLE_MAPS_API_KEY_IOS=AIzaSyC_exemplo_maps_ios_key_aqui
APP_ENV=development
```

### Verificação
```javascript
import { validateApiKeys, getApiKeysErrorMessage } from '../config/apiKeys';

const errorMessage = getApiKeysErrorMessage();
if (errorMessage) {
  console.log('Configuração necessária:', errorMessage);
} else {
  console.log('✅ Todas as chaves estão configuradas');
}
```

---

**Próximo passo**: Configure as chaves e teste a funcionalidade da API de clínicas! 