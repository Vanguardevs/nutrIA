# Otimizações de Performance - NutrIA

Este documento descreve as otimizações implementadas para melhorar a performance do aplicativo NutrIA.

## 🚀 Otimizações Implementadas

### 1. Sistema de Cache Inteligente

#### Cache de Alimentos (`foodsLoader.js`)
- **Cache em memória**: Dados carregados uma vez e mantidos em memória
- **Cache persistente**: AsyncStorage para persistência entre sessões
- **Limpeza automática**: Remove caches antigos automaticamente
- **Tratamento de erro robusto**: Lida com erros de disco cheio
- **Fallback**: Usa require() se o cache falhar

```javascript
// Carregamento otimizado
const foodsData = await loadFoodsData();
```

#### Cache de API (`apiCache.js`)
- **TTL (Time To Live)**: Cache expira em 5 minutos
- **Cache em memória**: Acesso rápido a dados recentes
- **Limpeza automática**: Remove caches expirados
- **Tamanho limitado**: Máximo de 3MB para cache da API

### 2. Proteção contra Duplicação

#### CreateDiary.js
- **Proteção múltipla**: 4 camadas de proteção contra execuções simultâneas
- **Debounce robusto**: 3 segundos entre execuções
- **Função preventMultipleExecutions**: Garante execução única
- **Cleanup adequado**: Reset de todas as proteções

```javascript
// Proteção contra múltiplas execuções
const salvarAgenda = useCallback(
    preventMultipleExecutions(_salvarAgendaInterno),
    [refeicao, hora, tipoRefeicao, navigation, isSaving, loading]
);
```

### 3. Otimizações de Renderização

#### React.memo e useCallback
- **Componentes memorizados**: Evita re-renderizações desnecessárias
- **Callbacks otimizados**: Funções estáveis entre renders
- **useMemo**: Cálculos custosos memorizados

#### FlatList Otimizada
- **removeClippedSubviews**: Remove itens fora da tela
- **maxToRenderPerBatch**: Limita itens renderizados por lote
- **windowSize**: Controla janela de renderização
- **getItemLayout**: Otimização para itens de tamanho fixo

### 4. Animações Otimizadas

#### useNativeDriver
- **Animações nativas**: Executadas na thread nativa
- **Performance melhorada**: Sem bloqueio da thread JS
- **Cleanup adequado**: Remove listeners ao desmontar

### 5. Configurações do Metro Bundler

#### metro.config.js
- **Cache otimizado**: Melhor performance de build
- **Resolução otimizada**: Extensões configuradas
- **Transforms**: Babel configurado para performance

#### babel.config.js
- **Presets otimizados**: Configuração para Expo
- **Plugins de performance**: Otimizações específicas

### 6. Tratamento de Erro de Disco Cheio

#### Sistema de Limpeza Automática
- **Detecção de erro**: Identifica erros SQLITE_FULL
- **Limpeza inteligente**: Remove caches antigos automaticamente
- **Verificação de tamanho**: Monitora uso de espaço
- **Fallback robusto**: Continua funcionando mesmo sem cache

```javascript
// Limpeza automática quando disco está cheio
if (error.message.includes('SQLITE_FULL') || error.message.includes('disk is full')) {
    console.log('Disco cheio detectado, tentando limpeza...');
    await cleanupOldCache();
}
```

#### Limpeza Diária
- **Execução automática**: Uma vez por dia na inicialização
- **Cache de limpeza**: Evita limpeza desnecessária
- **Logs detalhados**: Para monitoramento

### 7. Firebase Listener Otimizado

#### Diary.js
- **Cleanup de listeners**: Remove inscrições anteriores
- **Prevenção de duplicação**: Evita múltiplas inscrições
- **Logs melhorados**: Para facilitar debug

```javascript
// Remove inscrição anterior se existir
if (unsubscribeRef.current) {
    off(agenaRef, 'value', unsubscribeRef.current);
    unsubscribeRef.current = null;
}
```

### 8. Utilitários de Performance

#### performance.js
- **robustDebounce**: Debounce mais robusto
- **preventMultipleExecutions**: Previne execuções simultâneas
- **memoizeWithTTL**: Cache com tempo de vida
- **throttle**: Limitação de frequência
- **clearAllAppCaches**: Limpeza manual de caches
- **getCacheStatus**: Monitoramento de caches

## 📊 Benefícios das Otimizações

### Performance
- **Carregamento mais rápido**: Cache reduz tempo de carregamento
- **Menos re-renderizações**: Componentes otimizados
- **Animações suaves**: useNativeDriver
- **Menos uso de memória**: Limpeza automática

### Estabilidade
- **Sem duplicações**: Proteções robustas
- **Tratamento de erro**: Fallbacks para situações críticas
- **Limpeza automática**: Evita acúmulo de dados

### Experiência do Usuário
- **Interface responsiva**: Menos travamentos
- **Carregamento instantâneo**: Cache em memória
- **Feedback visual**: Indicadores de loading

## 🔧 Como Usar

### Cache de Alimentos
```javascript
import { loadFoodsData, clearFoodsCache } from '../utils/foodsLoader';

// Carregar dados
const foods = await loadFoodsData();

// Limpar cache se necessário
await clearFoodsCache();
```

### Cache de API
```javascript
import { cachedRequest, clearAllCaches } from '../utils/apiCache';

// Requisição com cache
const data = await cachedRequest('https://api.example.com/data');

// Limpar todos os caches
await clearAllCaches();
```

### Proteção contra Duplicação
```javascript
import { preventMultipleExecutions } from '../utils/performance';

const protectedFunction = preventMultipleExecutions(async () => {
    // Sua função aqui
});
```

### Limpeza Manual de Caches
```javascript
import { clearAllAppCaches, getCacheStatus } from '../utils/performance';

// Limpar todos os caches
await clearAllAppCaches();

// Verificar status dos caches
const status = await getCacheStatus();
console.log('Tamanho total dos caches:', status.total.sizeMB, 'MB');
```

## 🚨 Solução de Problemas

### Erro de Disco Cheio
Se você encontrar o erro `SQLITE_FULL` ou `disk is full`:

1. **Limpeza automática**: O sistema tentará limpar automaticamente
2. **Limpeza manual**: Use `clearAllAppCaches()`
3. **Reiniciar app**: Se necessário, reinicie o aplicativo

### Duplicação de Agendas
Se agendas estiverem sendo duplicadas:

1. **Verifique logs**: Procure por mensagens de proteção
2. **Aguarde**: O debounce de 3 segundos deve resolver
3. **Reinicie**: Se persistir, reinicie o app

### Performance Lenta
Se o app estiver lento:

1. **Verifique caches**: Use `getCacheStatus()`
2. **Limpe caches**: Use `clearAllAppCaches()`
3. **Monitore logs**: Verifique se há erros

## 📈 Monitoramento

### Logs Importantes
- `Cache de alimentos carregado do AsyncStorage`
- `Limpeza automática: removidos X caches antigos`
- `Disco cheio detectado, tentando limpeza...`
- `Salvamento já em progresso, ignorando...`

### Métricas de Cache
- Tamanho total dos caches
- Número de itens em cache
- Frequência de limpeza automática

## 🔄 Manutenção

### Limpeza Automática
- **Diária**: Executada na inicialização do app
- **Por tamanho**: Quando cache excede limites
- **Por erro**: Quando detecta disco cheio

### Monitoramento Contínuo
- **Logs**: Verificar logs regularmente
- **Performance**: Monitorar tempo de carregamento
- **Erros**: Acompanhar erros de cache

---

**Última atualização**: Implementação de tratamento robusto para erro de disco cheio e limpeza automática de caches. 