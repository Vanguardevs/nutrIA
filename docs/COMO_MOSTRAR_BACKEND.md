# Como Mostrar Seu Backend e Diagnosticar o Problema

## 🔍 **Passos para Diagnosticar:**

### **1. Execute o Debug Detalhado**
```bash
# No terminal, na raiz do projeto nutrIA
node debug-backend.js
```

### **2. Me Mostre os Resultados**
Copie e cole aqui:
- ✅ O resultado completo do `debug-backend.js`
- ✅ Os logs do seu backend (terminal onde roda `python main.py`)
- ✅ Qualquer erro que aparecer

## 📁 **Para Me Mostrar Seu Backend:**

### **Opção 1: Estrutura de Arquivos**
```
backend/
├── main.py
├── requirements.txt
├── data/
│   └── foods.json
└── [outros arquivos]
```

### **Opção 2: Código Principal**
Copie e cole aqui:
- `main.py` (arquivo principal)
- Qualquer arquivo de configuração importante
- Estrutura do `foods.json` (primeiras linhas)

### **Opção 3: Logs do Backend**
Quando você faz uma requisição no app, me mostre:
- O que aparece no terminal do backend
- Qualquer erro que aparecer

## 🚨 **Problemas Comuns e Soluções:**

### **1. React Native + Localhost**
**Problema**: React Native não consegue acessar `localhost`
**Solução**: Use `10.0.2.2` (Android) ou `localhost` (iOS)

### **2. CORS**
**Problema**: Erro de CORS
**Solução**: Adicionar CORS no FastAPI

### **3. Estrutura da Resposta**
**Problema**: Estrutura diferente do esperado
**Solução**: Ajustar formato da resposta

## 🧪 **Teste Rápido:**

### **1. Teste no Navegador**
Abra: `http://localhost:8000/health`
Deve retornar: `{"status":"OK","environment":"local"}`

### **2. Teste com curl**
```bash
curl -X POST http://localhost:8000/question \
  -H "Content-Type: application/json" \
  -d '{"pergunta":"teste","id_user":"test"}'
```

### **3. Teste no Postman/Insomnia**
- URL: `http://localhost:8000/question`
- Method: POST
- Headers: `Content-Type: application/json`
- Body: `{"pergunta":"teste","id_user":"test"}`

## 📋 **Informações que Preciso:**

1. **Resultado do debug-backend.js**
2. **Código do main.py**
3. **Logs do backend quando faz requisição**
4. **Estrutura do foods.json**
5. **Qualquer erro específico**

## 🎯 **Exemplo de Resposta Esperada:**

### **Backend (main.py):**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/question")
async def handle_question(request: dict):
    return {
        "message": {
            "resposta": "Resposta da IA aqui..."
        }
    }
```

### **Resposta Esperada:**
```json
{
  "message": {
    "resposta": "Uma maçã tem aproximadamente 52 calorias..."
  }
}
```

## 🔧 **Soluções Rápidas:**

### **Se o debug passar mas o app falhar:**
1. Mude `localhost` para `10.0.2.2` no `apiConfig.js`
2. Verifique se está usando emulador Android
3. Teste em dispositivo físico

### **Se o debug falhar:**
1. Verifique se o backend está rodando
2. Verifique a porta 8000
3. Verifique CORS

**Me mostre os resultados do debug e eu te ajudo a resolver!** 🚀 