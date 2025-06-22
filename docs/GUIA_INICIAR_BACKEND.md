# 🚀 Guia para Iniciar o Backend NutrIA

## Problema Identificado
O backend estava rodando apenas em `localhost` (127.0.0.1), mas o emulador Android precisa acessar via `10.0.2.2:8000`.

## Solução
Use o script `start_server.py` que configura o servidor para aceitar conexões de qualquer IP.

## Passos para Resolver

### 1. Pare o servidor atual (se estiver rodando)
- Pressione `Ctrl+C` no terminal onde o servidor está rodando

### 2. Inicie o servidor com o script correto
```bash
python start_server.py
```

### 3. Verifique se está funcionando
O servidor deve mostrar:
```
🚀 Iniciando servidor NutrIA para emulador Android...
📍 Host: 0.0.0.0
🔌 Porta: 8000
🌐 URL Local: http://localhost:8000
📱 URL Emulador: http://10.0.2.2:8000
==================================================
```

### 4. Teste a conexão
```bash
node test-ia-simple.js
```

### 5. Teste no app
- Reinicie o app no emulador
- Tente enviar uma mensagem para a IA

## Diferença Importante

**❌ Comando antigo (só funcionava localmente):**
```bash
uvicorn main:app --reload
```

**✅ Comando novo (funciona com emulador):**
```bash
python start_server.py
```

## Se ainda não funcionar

1. **Verifique o firewall do Windows**
   - Temporariamente desabilite o firewall para testar
   - Se funcionar, adicione uma regra para liberar a porta 8000

2. **Teste em dispositivo físico**
   - Use o IP real do seu PC na rede local
   - Exemplo: `http://192.168.1.100:8000`

3. **Verifique se o backend está rodando**
   ```bash
   netstat -an | findstr :8000
   ```

## Logs Úteis
- O app agora tem logs detalhados no console
- Verifique o Metro bundler para ver os logs do React Native
- O backend mostrará logs de requisições recebidas 