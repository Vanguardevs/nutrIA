# Configuração de API - Local vs Render

## 🚀 Como Alternar Entre Ambientes

### **Para usar LOCAL (desenvolvimento):**
```javascript
// Em src/config/apiConfig.js, linha 25
const CURRENT_ENV = 'LOCAL'; // ✅ Para desenvolvimento local
```

### **Para usar RENDER (produção):**
```javascript
// Em src/config/apiConfig.js, linha 25
const CURRENT_ENV = 'RENDER'; // ✅ Para servidor online
```

## 📋 Configurações por Ambiente

### **LOCAL (Desenvolvimento)**
- **URL Base**: `http://localhost:8000` ⚠️ **ATUALIZADO para porta 8000**
- **Timeout**: 10 segundos
- **Retries**: 2 tentativas
- **Uso**: Para desenvolvimento e testes locais

### **RENDER (Produção)**
- **URL Base**: `https://nutria-6uny.onrender.com`
- **Timeout**: 15 segundos
- **Retries**: 3 tentativas
- **Uso**: Para produção e usuários finais

## 🔧 Como Configurar o Backend Local

### **1. Estrutura do Backend Local**
```
seu-backend/
├── main.py (FastAPI)
├── requirements.txt
├── data/
│   └── foods.json
└── utils/
    ├── foodSearch.py
    └── nutritionalProcessor.py
```

### **2. Exemplo de `main.py` (FastAPI)**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    pergunta: str
    id_user: str

@app.post("/question")
async def handle_question(request: QuestionRequest):
    try:
        print(f"📥 Pergunta recebida: '{request.pergunta}'")
        
        # Aqui você implementa a busca no foods.json
        # e a chamada para a IA
        
        return {
            "message": {
                "resposta": "Resposta da IA aqui..."
            }
        }
    except Exception as e:
        print(f"❌ Erro: {e}")
        raise HTTPException(status_code=500, detail="Erro interno")

@app.get("/health")
async def health_check():
    return {"status": "OK", "environment": "local"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🎯 Passos para Configurar

### **1. Configurar Frontend**
```bash
# O arquivo src/config/apiConfig.js já está configurado para porta 8000
# Verifique se a linha 25 está assim:
const CURRENT_ENV = 'LOCAL';
```

### **2. Iniciar Backend Local**
```bash
# No diretório do seu backend
python main.py
# Deve mostrar: INFO: Uvicorn running on http://0.0.0.0:8000
```

### **3. Testar Conexão**
```bash
# Teste se o backend está rodando
curl http://localhost:8000/health
# Deve retornar: {"status":"OK","environment":"local"}

# Ou use o script de teste
node test-connection.js
```

### **4. Testar no App**
- Abra o app
- Vá para o chat
- Digite uma pergunta como "Quantas calorias tem uma maçã?"
- Verifique os logs no terminal

## 🔍 Logs de Debug

### **Frontend (App)**
```
🚀 API Configurada para: LOCAL
📍 URL Base: http://localhost:8000
⏱️  Timeout: 10000ms
🔄 Retries: 2
📤 Enviando pergunta para LOCAL: Quantas calorias tem uma maçã?
📍 URL: http://localhost:8000/question
```

### **Backend (Terminal)**
```
INFO: Uvicorn running on http://0.0.0.0:8000
📥 Pergunta recebida: "Quantas calorias tem uma maçã?"
🍎 Encontrados 6 alimentos relevantes para: Quantas calorias tem uma maçã?
🧠 IA interpretou: ...
INFO: 127.0.0.1:xxxxx - "POST /question HTTP/1.1" 200 OK
```

## ⚠️ Troubleshooting

### **Erro de Conexão Local**
```
❌ Erro: connect ECONNREFUSED 127.0.0.1:8000
```
**Solução**: Verifique se o backend está rodando na porta 8000

### **Erro de CORS**
```
❌ Erro: CORS policy
```
**Solução**: Adicione CORS no backend (já incluído no exemplo)

### **Timeout**
```
❌ Erro: timeout
```
**Solução**: Aumente o timeout em `apiConfig.js`

### **Network Error**
```
❌ Erro: Network Error
```
**Solução**: 
1. Verifique se o backend está rodando
2. Teste com `curl http://localhost:8000/health`
3. Verifique se não há firewall bloqueando

## 🔄 Migração para Render

### **1. Preparar Backend para Render**
- Implemente o código do `backend-food-search-example.js`
- Configure variáveis de ambiente
- Teste localmente

### **2. Deploy no Render**
- Conecte seu repositório
- Configure build commands
- Defina variáveis de ambiente

### **3. Atualizar Frontend**
```javascript
// Em src/config/apiConfig.js, linha 25
const CURRENT_ENV = 'RENDER'; // ✅ Mude para RENDER
```

### **4. Testar**
- Teste o endpoint no Render
- Teste no app
- Verifique logs

## 📊 Comparação de Performance

| Métrica | Local (8000) | Render |
|---------|--------------|--------|
| Latência | ~10ms | ~200ms |
| Confiabilidade | Alta | Média |
| Debug | Fácil | Difícil |
| Deploy | Instantâneo | ~2min |

## 🎉 Benefícios da Configuração

### **Desenvolvimento**
- ✅ Debug mais fácil
- ✅ Resposta mais rápida
- ✅ Controle total do ambiente
- ✅ Testes isolados

### **Produção**
- ✅ Servidor sempre online
- ✅ Escalabilidade
- ✅ Backup automático
- ✅ Monitoramento 