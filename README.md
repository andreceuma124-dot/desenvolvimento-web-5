# Mini Projeto: Consumo de APIs, Assincronismo e Manipulação do DOM

Este repositório contém a implementação prática de consumo de APIs REST públicas (ViaCEP e PokéAPI), validação de dados e gerenciamento de estados da interface.

## Quatro Estados da Tela Tratados

1. **Carregando**: Mensagem temporária informando o progresso da requisição com desativação preventiva dos botões.
2. **Erro**: Tratamento de falhas de rede e respostas com status de erro HTTP (como 404), tratadas via `if (!response.ok)`.
3. **Vazio / Não Encontrado**: Validação específica de dados retornados (como `{ erro: true }` no ViaCEP ou mensagens de busca vazia).
4. **Sucesso**: Limpeza dos containers com `.replaceChildren()` e renderização segura via `.textContent` e `.createElement()`.

---

## Parte 4 – Reflexão: Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

Ao utilizar o `await` de forma sequencial em um loop ou em linhas consecutivas:

```javascript
const res1 = await fetch(url1);
const res2 = await fetch(url2);
const res3 = await fetch(url3);
