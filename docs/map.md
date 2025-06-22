# Tela de Mapa - Clínicas Próximas

## Descrição
Esta tela permite aos usuários localizar clínicas e postos de saúde próximos à sua localização atual, incluindo nutricionistas e unidades básicas de saúde.

## Funcionalidades

### 🗺️ Mapa Interativo
- Visualização em tempo real da localização do usuário
- Marcadores personalizados para diferentes tipos de estabelecimentos
- Botão para centralizar no usuário
- Suporte ao Google Maps

### 📍 Localização
- Solicita permissões de localização automaticamente
- Mostra a posição atual do usuário no mapa
- Tratamento de erros de localização

### 🏥 Lista de Clínicas
- Cards informativos com detalhes das clínicas
- Avaliações e informações de contato
- Diferenciação visual entre nutricionistas e postos de saúde
- Seleção interativa dos marcadores

### 📞 Ações Disponíveis
- **Ligar**: Abre o discador com o número da clínica
- **Navegar**: Abre o Google Maps com rota para a clínica

## Tipos de Estabelecimentos

### Nutricionistas
- Ícone: 🍽️ (restaurant)
- Cor: Verde (#2E8331)
- Especializados em nutrição clínica e esportiva

### Postos de Saúde
- Ícone: 🏥 (medical)
- Cor: Azul (#007AFF)
- Unidades básicas de saúde e atendimento geral

## Dependências

```json
{
  "react-native-maps": "^1.7.1",
  "expo-location": "^16.5.5"
}
```

## Permissões Necessárias

### Android
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

### iOS
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`

## Como Usar

1. Acesse a tela através do botão de mapa no header da tela Home
2. Permita o acesso à localização quando solicitado
3. Visualize as clínicas próximas no mapa
4. Toque em um marcador para ver detalhes
5. Use os botões "Ligar" ou "Navegar" para interagir com a clínica

## Estrutura de Dados

```javascript
const clinic = {
  id: 1,
  name: 'Nome da Clínica',
  type: 'Nutricionista' | 'Posto de Saúde',
  address: 'Endereço completo',
  phone: '(11) 99999-9999',
  rating: 4.8,
  coordinate: {
    latitude: -23.5505,
    longitude: -46.6333,
  },
  description: 'Descrição da clínica'
}
```

## Melhorias Futuras

- [ ] Integração com API real do Google Places
- [ ] Filtros por tipo de estabelecimento
- [ ] Busca por endereço
- [ ] Avaliações em tempo real
- [ ] Agendamento de consultas
- [ ] Histórico de clínicas visitadas 