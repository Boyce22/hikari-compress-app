# Hikari Compress App

## Sobre o Projeto

O Hikari Compress é um aplicativo de desktop de código aberto, desenvolvido para compressão de vídeos. O objetivo
principal é oferecer uma interface de usuário intuitiva para reduzir o tamanho de arquivos de vídeo de forma eficiente,
utilizando codecs modernos e configurações otimizadas, sem uma perda perceptível de qualidade visual.

A aplicação é construída com Electron, React e Nodejs.

## Tecnologias Utilizadas

- **Framework Principal**: [Electron](https://www.electronjs.org/)
- **Interface de Usuário (UI)**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Empacotamento**: [Electron Builder](https://www.electron.build/)

## Estrutura do Projeto

A estrutura do projeto é organizada para separar claramente as responsabilidades entre o processo principal do Electron,
o processo de renderização (a interface do usuário) e o código compartilhado entre eles.

```
/
├── build/                  # Ícones e assets para o build da aplicação
├── resources/              # Assets estáticos não compilados
├── src/
│   ├── main/               # Código do Processo Principal do Electron
│   │   ├── index.ts        # Ponto de entrada principal, gerencia janelas e eventos do sistema
│   │   └── node/           # Módulos Node.js específicos para o processo principal
│   │       ├── compress.ts # Lógica de compressão de vídeo (provavelmente usando ffmpeg)
│   │       └── get-system-specs.ts # Lógica para obter especificações do sistema
│   │
│   ├── preload/            # Scripts de Preload do Electron
│   │   ├── index.ts        # Expõe APIs do Node.js/Electron de forma segura para o Renderer
│   │   └── index.d.ts      # Definições de tipo para as APIs expostas
│   │
│   ├── renderer/           # Código do Processo de Renderização (React App)
│   │   ├── index.html      # Arquivo HTML base
│   │   ├── app/            # Configurações globais da aplicação, como providers e rotas
│   │   │   ├── main.tsx    # Ponto de entrada da aplicação React
│   │   │   ├── App.tsx     # Componente raiz da aplicação
│   │   │   └── providers/  # Provedores de contexto React
│   │   │
│   │   ├── components/     # Componentes React reutilizáveis
│   │   ├── features/       # Agrupamento de funcionalidades completas da aplicação
│   │   ├── hooks/          # Hooks customizados para lógica e estado
│   │   ├── lib/            # Funções utilitárias para o frontend
│   │   └── assets/         # Assets como imagens e estilos
│   │
│   └── shared/             # Código compartilhado entre os processos Main e Renderer
│       ├── adapters/       # Adaptadores para transformar estruturas de dados
│       ├── types/          # Definições de tipo e interfaces globais
│       └── utils/          # Funções utilitárias compartilhadas
│
├── electron-builder.yml    # Configuração do Electron Builder para criar instaladores
├── electron.vite.config.ts # Configuração do Vite para Electron
├── package.json            # Metadados do projeto, dependências e scripts
└── tailwind.config.ts      # Configuração do Tailwind CSS
```

### Descrição das Pastas Principais

- **`src/main`**: Contém toda a lógica backend que roda no ambiente Node.js do Electron. Isso inclui a criação de
  janelas, comunicação inter-processos (IPC) e acesso a recursos do sistema operacional, como o sistema de arquivos.
- **`src/preload`**: Atua como uma ponte segura entre o backend (`main`) e o frontend (`renderer`). Ele filtra e expõe
  funcionalidades do Node.js que o frontend precisa.
- **`src/renderer`**: É a aplicação React que contém a interface gráfica. Este código roda em um ambiente de navegador
  (Chromium) e não tem acesso direto às APIs do Node.js, exceto pelo que é exposto via script de `preload`.
- **`src/shared`**: Essencial para evitar duplicação de código. Contém tipos, interfaces e funções que são utilizados
  tanto pelo processo `main` quanto pelo `renderer`.

## Como Começar

Para executar o projeto em seu ambiente de desenvolvimento local, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/en) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)

### Instalação

1.  Clone o repositório para a sua máquina local.
2.  Navegue até o diretório raiz do projeto.
3.  Instale as dependências com o comando:
    ```bash
    npm install
    ```

### Executando em Desenvolvimento

Para iniciar o aplicativo em modo de desenvolvimento, com hot-reload ativado, execute o seguinte comando:

```bash
npm run dev
```

---

## Scripts Disponíveis

O projeto inclui vários scripts para auxiliar no desenvolvimento e build:

- **`npm run dev`**: Inicia a aplicação em modo de desenvolvimento.
- **`npm run build`**: Compila e transpila o código TypeScript e prepara a aplicação para o empacotamento.
- **`npm run build:win`**: Gera o instalador para Windows.
- **`npm run build:mac`**: Gera o instalador para macOS.
- **`npm run build:linux`**: Gera o instalador para Linux.
- **`npm run format`**: Formata todo o código do projeto usando o Prettier.
- **`npm run lint`**: Analisa o código em busca de erros e problemas de estilo com o ESLint.
- **`npm run typecheck`**: Verifica os tipos de todo o projeto TypeScript.

---

## Build e Empacotamento

Para criar uma versão distribuível da aplicação, você pode usar os scripts de build. O processo é configurado pelo
`electron-builder`.

1.  Execute o script de build para a sua plataforma de destino (ex: `npm run build:win`).
2.  Os artefatos da compilação, incluindo o instalador, serão gerados no diretório `out/`.

##### Observação Importante:

Durante o **desenvolvimento**, **sempre mantenha o projeto rodando com o comando `npm run dev`**.  
Esse modo ativa o **ambiente de desenvolvimento**, que:

- **Recarrega automaticamente** as alterações no código (**hot reload**);
- **Mostra mensagens de erro detalhadas**;
- E é **otimizado para testar e ajustar** o projeto rapidamente.

Já o comando **`npm run build`** deve ser usado **somente quando o projeto estiver pronto para ser publicado ou testado
em produção**.
