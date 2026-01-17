# Controle de Gastos Diários

Este é um site simples para controlar entradas (ganhos) e saídas (gastos) diários.

## Como usar

1. Abra o arquivo `index.html` no seu navegador.
2. Preencha o formulário para adicionar uma transação:
   - Descrição: O que é a transação.
   - Valor: O montante em reais.
   - Tipo: Entrada (ganho) ou Saída (gasto).
3. Clique em "Adicionar" para registrar a transação.
4. Veja o resumo e a lista de transações na página.

## Funcionalidades

- Adicionar transações de entrada e saída.
- Calcular automaticamente o saldo total e porcentagem de lucro.
- Exibir gráfico de pizza mostrando a porcentagem de lucro vs. gastos.
- Botão de reset para zerar todos os dados e recomeçar.
- Armazenar dados localmente no navegador (usando localStorage).
- Interface simples e responsiva.

## Executando

Para executar, basta abrir `index.html` em qualquer navegador moderno.

Se quiser executar um servidor local (opcional), instale o `http-server` via npm:

```
npm install -g http-server
http-server
```

Então, acesse `http://localhost:8080` no navegador.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6)
