# 🎓 Estante Virtual - PPGHCA Unigranrio Afya

Uma solução elegante e dinâmica para organização de conteúdos acadêmicos, disciplinas e cronogramas, alimentada diretamente por uma planilha do Google Sheets.

## 🚀 Funcionalidades

- **Motor Dinâmico Modular**: Arquitetura baseada em módulos nativos (ES6 Modules).
- **Visual Premium**: Design moderno baseado na identidade visual da Afya (Magenta/Deep Blue).
- **Cards Interativos**:
  - **"Leia Mais"**: Expansão inteligente para descrições longas.
  - **Compartilhamento**: Envio rápido de detalhes da aula para colegas.
  - **Calendário**: Salve prazos e aulas diretamente na agenda (arquivo `.ics`).
- **Área de Avaliação**: Footer dedicado e discreto para critérios de nota.
- **Configuração Simples**: Gerencie tudo pelo arquivo `config.env` sem mexer no código.

---

## 🛠️ Como Configurar sua Estante

### 1. Preparar a Planilha do Google
Sua planilha deve ter 3 abas principais com as colunas certas:

- **Aba `DadosDoAcervo`**:
  - `Tipo de Literatura`, `Objetivo`.
- **Aba `ConteudoEstante`**:
  - `Tipo de Literatura`, `Título`, `Autor`, `Ano`, `Categoria`, `Link`, `Link AudioBook`, `Lido`.

**IMPORTANTE**: No Google Sheets, vá em `Arquivo > Compartilhar > Publicar na Web`. Escolha `Documento Inteiro` e `Valores separados por vírgulas (.csv)`. Copie o ID da planilha.

### 2. Configurar o Projeto (`config.env`)
Abra o arquivo [`config.env`](./config.env) na raiz do projeto e cole os dados:

```env
SHEET_ID=seu_id_da_planilha_aqui
TAB_ACERVO=DadosDoAcervo
TAB_CONTEUDO=ConteudoEstante
```

### 3. Estrutura de Arquivos Modular
O projeto utiliza uma arquitetura baseada em **Design Patterns**:
- `index.html`: Ponto de entrada principal.
- `config.env`: Arquivo de configuração.
- `assets/js/main.js`: Orquestrador da aplicação.
- `assets/js/modules/Config.js`: Gerenciador de ambiente.
- `assets/js/modules/DataService.js`: Serviço de dados (Sheets).
- `assets/js/modules/UIComponents.js`: Fábrica de interface.
- `assets/js/modules/Utils.js`: Utilitários (Share/Calendar).

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
- **v3.3.0**: Refatoração completa para arquitetura modular (ES6 Modules).
- **v3.2.0**: Alteração da licença para Creative Commons BY-NC 4.0.
- **v3.1.0**: Atualização de créditos e inclusão do núcleo NELPED.
- **v3.0.0**: Migração para estrutura de pastas profissional e configuração via `.env`.
