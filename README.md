# 🎓 Estante Virtual - PPGHCA Unigranrio Afya

Uma solução elegante e dinâmica para organização de conteúdos acadêmicos, disciplinas e cronogramas, alimentada diretamente por uma planilha do Google Sheets.

## 🚀 Funcionalidades

- **Motor Dinâmico**: Carrega dados em tempo real do Google Sheets.
- **Visual Premium**: Design moderno baseado na identidade visual da Afya (Magenta/Deep Blue).
- **Cards Interativos**:
  - **"Leia Mais"**: Expansão inteligente para descrições longas.
  - **Compartilhamento**: Envio rápido de detalhes da aula para colegas.
  - **Calendário**: Salve prazos e aulas diretamente na agenda (arquivo `.ics`).
- **Área de Avaliação**: Footer dedicado e discreto para critérios de nota.
- **Configuração Simples**: Gerencie tudo pelo arquivo `.env` sem mexer no código.

---

## 🛠️ Como Configurar sua Estante

### 1. Preparar a Planilha do Google
Sua planilha deve ter 3 abas principais com as colunas certas:

- **Aba `DadosDisciplina`**:
  - `Disciplina`, `Professora 1`, `Contato Professora 1`, `Professora 2` (opcional), `Contato Professora 2` (opcional), `Horário`, `Dia da Semana`.
- **Aba `Cronograma`**:
  - `Disciplina`, `Data aula`, `Descrição Conteúdo`, `Link do Conteúdo`, `Obsevação`.
- **Aba `Avaliação`**:
  - `Disciplina`, `Descrição dos Critérios`, `Peso`, `Data limite de entrega`, `Observação`.

**IMPORTANTE**: No Google Sheets, vá em `Arquivo > Compartilhar > Publicar na Web`. Escolha `Documento Inteiro` e `Valores separados por vírgulas (.csv)`. Copie o ID da planilha (o código longo na URL entre `/d/` e `/edit`).

### 2. Configurar o Projeto (`.env`)
Abra o arquivo [`.env`](./.env) na raiz do projeto e cole os dados:

```env
SHEET_ID=seu_id_da_planilha_aqui
TAB_DISCIPLINA=DadosDisciplina
TAB_CRONOGRAMA=Cronograma
TAB_AVALIACAO=Avaliação
```

### 3. Estrutura de Arquivos
O projeto segue uma organização profissional:
- `/assets/js/app.js`: Lógica do motor.
- `/assets/css/style.css`: Estilos e design.
- `/docs/skill.md`: Visão e regras do projeto.
- `index.html`: Página principal.

---

## 🌐 Como Publicar (GitHub Pages)

1. Suba todos os arquivos para um repositório no **GitHub**.
2. Vá em `Settings > Pages`.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde o link ser gerado.

---

## 👨‍💻 Créditos e Desenvolvimento

Este projeto é fruto da pesquisa e desenvolvimento vinculada ao:
- **Núcleo de Estudos em Linguagens, Práticas Educacionais e Cultura Digital - NELPED**
- **Mestrado PPGHCA - Unigranrio Afya**

**Pesquisador Responsável:** 
[Eduardo Bastos](https://www.linkedin.com/in/eduardobbastos/)

---

## 📄 Licença
Esta obra está licenciada sob uma [Licença Creative Commons Atribuição-NãoComercial 4.0 Internacional (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

---

## 📝 Notas de Versão
- **v3.2.0**: Alteração da licença para Creative Commons BY-NC 4.0.
- **v3.1.0**: Atualização de créditos e inclusão do núcleo NELPED.
- **v3.0.0**: Migração para estrutura de pastas profissional e configuração via `.env`.
- **v2.2.0**: Implementação de compartilhamento seletivo e correção de sintaxe.
- **v2.1.0**: Adição de botões de calendário e compartilhamento nativo.
