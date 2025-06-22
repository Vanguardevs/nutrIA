# Correção do Limite de Peso para 400 kg

## Problema Identificado
O campo de peso estava aceitando valores até 999 kg, mas o usuário solicitou que o limite máximo fosse reduzido para 400 kg.

## Alterações Realizadas

### 1. Arquivo: `src/pages/main/Config/HealthData.js`
- **Função `validarPeso`**: Adicionada nova função para validar peso entre 20 e 400 kg
- **Validação no `salvarDados`**: Implementada validação antes de salvar os dados
- **Placeholder atualizado**: Alterado de "até 999 kg" para "20 - 400 kg"

### 2. Arquivo: `src/pages/login/registers/HealthRegister.js`
- **Função `validarPeso`**: Adicionada função de validação idêntica
- **Validação no `cadastro`**: Implementada validação antes do cadastro
- **Placeholder atualizado**: Alterado para mostrar o novo limite
- **Modal de erro**: Utiliza o CustomModal para exibir erro de peso inválido

## Funcionalidades Implementadas

### Validação de Peso
- **Mínimo**: 20 kg
- **Máximo**: 400 kg
- **Formato**: Aceita números com vírgula (ex: 70,5)
- **Feedback**: Mensagem clara quando o peso está fora do limite

### Formatação
- Aceita até 3 dígitos
- Formata automaticamente com vírgula quando necessário
- Remove caracteres não numéricos

## Benefícios
1. **Limite realista**: 400 kg é um limite mais realista para aplicação de nutrição
2. **Validação consistente**: Mesma validação em cadastro e edição
3. **Feedback claro**: Usuário recebe orientação sobre o limite
4. **Interface melhorada**: Placeholders informativos

## Arquivos Modificados
- `src/pages/main/Config/HealthData.js`
- `src/pages/login/registers/HealthRegister.js`

## Data da Implementação
$(date) 