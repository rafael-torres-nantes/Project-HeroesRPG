# Project RPGUI — Sistema H.I.K. v2.0

## 👨‍💻 Projeto desenvolvido por: 
[Rafael Torres Nantes](https://github.com/rafael-torres-nantes)

## Índice

* [📚 Contextualização do projeto](#-contextualização-do-projeto)
* [🛠️ Tecnologias/Ferramentas utilizadas](#%EF%B8%8F-tecnologiasferramentas-utilizadas)
* [🖥️ Funcionamento do sistema](#%EF%B8%8F-funcionamento-do-sistema)
   * [🧩 Parte 1 - Superprompts](#-parte-1---superprompts)
   * [🎨 Parte 2 - Interface Web (RPGUI)](#-parte-2---interface-web-rpgui)
* [🔀 Mecânicas do Sistema](#-mecânicas-do-sistema)
* [📁 Estrutura do projeto](#-estrutura-do-projeto)
* [📌 Como executar o projeto](#-como-executar-o-projeto)
* [🗺️ Roadmap](#%EF%B8%8F-roadmap)

## 📚 Contextualização do projeto

O projeto tem como objetivo principal criar uma solução completa para o **Sistema H.I.K. v2.0**, um sistema de RPG de mesa brasileiro. Ele fornece tanto uma interface visual (RPGUI) para gestão digital das fichas e itens, quanto uma biblioteca rica de **superprompts** desenhados para alimentar modelos de inteligência artificial generativa. Essas ferramentas em conjunto permitem gerar conteúdo balanceado matematicamente e automatizar o cálculo complexo das estatísticas derivadas.

## 🛠️ Tecnologias/Ferramentas utilizadas

[<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">](https://www.typescriptlang.org/)
[<img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black">](https://reactjs.org/)
[<img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white">](https://vitejs.dev/)
[<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white">](https://tailwindcss.com/)
[<img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white">](https://reactrouter.com/)
[<img src="https://img.shields.io/badge/Claude-F9E0CE?logo=anthropic&logoColor=black">](https://claude.ai/)

## 🖥️ Funcionamento do sistema

### 🧩 Parte 1 - Superprompts

Templates estruturados em `.txt` para organizar a geração de conteúdo em modelos de linguagem (como Claude, ChatGPT). Alimentam o balanceamento matemático do Sistema H.I.K. v2.0.

* **`characters_creator.txt`:** Geração de fichas de personagem com atributos, PV, PH, combate e habilidades.
* **`special_item_generator.txt`:** Criação de itens lendários/especiais onde habilidades possuem custos equitativos e condições estritas.
* **`techniques_generator.txt`:** Design de técnicas complexas atreladas a um sistema de custo profundo em Pontos de Índice (P.I.).
* **`Livro Básico RPG - Jogador Edition.docx`:** Base de conhecimento integral e regras do sistema.

**Como usar:** Basta copiar o conteúdo do arquivo `.txt` escolhido, colar em um LLM moderno e seguir as instruções e tabelas internas para produzir o resultado alinhado ao balanceamento.

### 🎨 Parte 2 - Interface Web (RPGUI)

O frontend foi construído em **React** para propiciar uma interface amigável aos jogadores e Mestres de Jogo (GMs). Permite adicionar dados na interface e calcular estatísticas automaticamente (PV, PH, Percepção passiva, defesas, locomoção, etc.), sem a necessidade de um backend dedicado, valendo-se da persistência no `localStorage`.

* **Criar e Editar Personagens:** Lida automaticamente com cálculos e modificadores (`/characters/new` e `/characters/:id`).
* **Criar e Editar Itens Mágicos:** Formulário inteligente para equipamentos com habilidades ativas e passivas (`/items/new` e `/items/:id`).
* **Dashboard:** Menu principal (`/`) com a listagem de todos seus ativos locais salvos.

## 🔀 Mecânicas do Sistema

O **Sistema H.I.K. v2.0** opera sob 6 atributos base e diversas derivações:

### Atributos Base
- **FOR** (Força): Combate corpo a corpo e peso suportado
- **AGI** (Agilidade): Locomoção, esquiva e percepção
- **INT** (Inteligência): Percepção, idiomas e capacidade mental
- **PRE** (Presença): Defesa mental e carisma
- **POD** (Poder): Reserva de energia (PH) e recuperação
- **VIG** (Vigor): Reserva de vida (PV) e recuperação

### Estatísticas Derivadas
- **PV Máx:** `12 + (nível × (6 + VIG)) + bônus VIG`
- **PH Máx:** `10 + (nível × (8 + POD)) + bônus POD`
- **Percepção Passiva:** `10 + AGI + INT + bônus`
- **Defesas:** Bloqueio (`FOR + Bloquear`), Esquiva (`AGI + Esquivar`), Mental (`PRE`)

### Arquétipos de Técnicas (Multiplicador de Custo P.I.)
| Conjuração | Corporal | Emissor | Manipulação | Quântico | Metamorfo | Mentalista |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0.4× | 0.5× | 0.6× | 0.7× | 0.8× | 0.9× | 1.0× |

## 📁 Estrutura do projeto

A organização estrutural e de diretórios se dá da seguinte forma:

```text
.
├── characters_creator.txt
├── special_item_generator.txt
├── techniques_generator.txt
├── README.md
└── rpgui/
    ├── public/
    ├── src/
    │   ├── components/      # Componentes UI reutilizáveis
    │   ├── data/            # Dados e atributos predefinidos
    │   ├── pages/           # Views das rotas principais
    │   ├── store/           # Lógica do localStorage
    │   ├── styles/          # Estilizações globais e temas
    │   ├── types/           # Definição de interfaces TS
    │   └── utils/           # Funções de cálculo matemático de fichas
    ├── index.html
    └── package.json
```

## 📌 Como executar o projeto

A interface GUI roda puramente no cliente. Siga os passos abaixo:

1. **Navegue até o diretório do app:**
   ```bash
   cd rpgui
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Abra o frontend em um navegador:**
   Acesse `http://localhost:5173`.

## 🗺️ Roadmap

- [x] Dashboard de personagens e itens
- [x] Editor de personagens com cálculo automático
- [x] Editor de itens especiais
- [ ] Módulo de técnicas (v2)
- [ ] Exportação/impressão de fichas em PDF
- [ ] Sincronização em nuvem
