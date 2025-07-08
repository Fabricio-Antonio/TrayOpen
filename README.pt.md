
<div align="center">

# TrayOpen

<img src="https://github.com/user-attachments/assets/fae2d448-fbb3-4fb5-adab-640a53f9ddb9" width="120" />
</div>
<br/>

<p align="center">
  <img src="https://img.shields.io/badge/conclude-green" />
  <img src="https://img.shields.io/badge/made%20with-Electron--JS-darkblue" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <br/>
  <a href="README.md">English version</a> | <strong>Portuguese version</strong>
</p>

## Descrição
TrayOpen é um aplicativo desktop minimalista desenvolvido com ElectronJS. Criei este projeto para explorar o desenvolvimento de aplicações desktop e integrar ferramentas de observabilidade como o Sentry.

## 🎯 Objetivo do projeto

TrayOpen é uma aplicação desktop minimalista desenvolvida com ElectronJS que roda na bandeja do sistema e oferece acesso instantâneo aos seus projetos recentes. Com apenas um clique, você pode abrir qualquer projeto diretamente no Visual Studio Code. Foi projetado para desenvolvedores que valorizam velocidade, simplicidade e produtividade no seu fluxo de trabalho diário.

### 🚀 Funcionalidades Principais
1. Interface de Bandeja do Sistema
- Aplicação fica minimizada na bandeja do sistema (tray)
- Ícone personalizado que se adapta ao sistema operacional (macOS usa iconTemplate.png, outros sistemas usam icon.png)

2. Gerenciamento de Projetos
- Adicionar Projetos: Menu "Add new project..." permite selecionar pastas de projetos através de um diálogo de navegação
- Listagem de Projetos: Exibe todos os projetos salvos com seus nomes (baseados no nome da pasta)
- Remoção de Projetos: Cada projeto tem uma opção "Remove" para excluí-lo da lista

3. Abertura Rápida no VS Code
- Cada projeto listado possui um submenu com a opção "Open in VS Code"
- Executa o comando code [caminho-do-projeto] para abrir diretamente no editor
- Integração nativa com o Visual Studio Code

4. Persistência de Dados
- Utiliza electron-store para salvar a lista de projetos localmente
- Dados são mantidos entre sessões da aplicação
- Schema de validação para garantir integridade dos dados

5. Inicialização Automática
- Configuração automática para iniciar com o sistema operacional (Windows e macOS)
- Funcionalidade de "openAtLogin" habilitada por padrão

6. Compatibilidade Multiplataforma
- Suporte para Windows, macOS e Linux
- Adaptação automática de ícones e comportamentos específicos do sistema
- No macOS, oculta o ícone do Dock para manter a interface limpa

7. Monitoramento e Estabilidade
- Integração com Sentry para monitoramento de erros e crashes
- Tratamento robusto de dados (validação de arrays e strings JSON)

## 👨‍💻 Tecnologias usadas 

| Technologies         | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Electron**   | Framework para construção de aplicações desktop multiplataforma usando tecnologias web como HTML, CSS e JavaScript. |
| **Sentry**           | Ferramenta de monitoramento de erros e desempenho usada para capturar e diagnosticar problemas em tempo real. |
| **JavaScript**     | Linguagem de programação principal utilizada para implementar a lógica da aplicação. |
| **electron-store** | Armazenamento leve e persistente baseado em chave-valor para apps Electron, usado para gerenciar e salvar dados localmente. |
| **Node.js** | Ambiente de execução que suporta o backend da aplicação Electron, permitindo acesso às APIs nativas do sistema. |

## 📋 Prerequisites
Antes de iniciar, tenha certeza de ter instalado
- Node.js (versão 18 ou superior)
- npm or yarn

## 🔧 Instalação
Clonar respositório:

```
git clone <https://github.com/Fabricio-Antonio/TrayOpen>
cd TrayOpen
```

Instalar dependências:

```
npm install
# or
yarn install
```

## 📁 Estrutura do projeto
```
TrayOpen/
├── main.js              # Arquivo principal da aplicação
├── package.json         # Configurações e dependências
├── assets/              # Ícones da aplicação
│   ├── icon.png         # Ícone para Windows/Linux
│   └── iconTemplate.png # Ícone para macOS
├── dist/                # Builds da aplicação
└── node_modules/        # Dependências
```

## 👥 Mantenha contato

- Author - [Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/)
- Website - [www.fabriciosantos.dev.br](https://www.fabriciosantos.dev.br)
- Youtube - [@DevFabricioSantos](https://www.youtube.com/@DevFabricioSantos)

## 📜 License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

### 🤝 Want to contribute?
Esse projeto está aberto para contribuições! Sinta-se livre para fazer um fork, abra uma issue ou mande um PR
This project is open to contributions! Feel free to fork, open an issue, or submit a PR.
