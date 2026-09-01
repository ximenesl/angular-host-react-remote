# Enterprise Monorepo: Angular Host + React Remote (Module Federation)

[![CI/CD Pipeline](https://github.com/ximenesl/angular-host-react-remote/actions/workflows/typescript-angular-app-workflow.yaml/badge.svg)](https://github.com/ximenesl/angular-host-react-remote/actions)
![Node Version](https://img.shields.io/badge/node->=%2018.0.0-brightgreen.svg)
![Turborepo](https://img.shields.io/badge/orchestrator-Turborepo-blueviolet.svg)
![Architecture](https://img.shields.io/badge/architecture-Micro--frontend-blue.svg)

Monorepo corporativo escalável combinando uma aplicação **Host em Angular 17+** e uma micro-frontend **Remote em React 18+**, integradas via **Webpack 5 Module Federation**, orquestrado com **Turborepo** e **npm workspaces**.

---

## 🏗️ Arquitetura do Projeto

```text
+-----------------------------------------------------------------------+
|                    MONOREPO ROOT (Turborepo & npm)                    |
+-----------------------------------------------------------------------+
       |                                                 |
       v                                                 v
+-----------------------------+               +-------------------------+
|   apps/host (Angular 17+)   |               | apps/remote (React 18+) |
| - Porta: 4200               |  -- Consome ->| - Porta: 4201           |
| - Ng-Zorro Ant Design       |  (Federation) | - Ant Design (antd)     |
| - Module Federation Plugin  |               | - Webpack 5 Exposes     |
+-----------------------------+               +-------------------------+
       |                                                 |
       +--------------------+   +------------------------+
                            |   |
                            v   v
              +--------------------------------+
              |     packages/shared-types      |
              | - TypeScript Interfaces & Core |
              +--------------------------------+
```

---

## 🛠️ Tecnologias Utilizadas

### Core & Frameworks
* **Host Application:** Angular 17+ (Standalone Components, Signals, Router, Ng-Zorro UI)
* **Remote Application:** React 18+ (Hooks, Ant Design)
* **Micro-Frontend Integration:** `@angular-architects/module-federation` + Webpack 5 Module Federation
* **Shared Types:** TypeScript Contract Package (`@mfe/shared-types`)

### Monorepo & Build Tools
* **Orquestrador:** Turborepo 2.x
* **Gerenciador de Pacotes:** `npm workspaces`
* **Ferramenta de Build do Remote:** Webpack 5 + Babel

### CI/CD & Segurança
* **GitHub Actions:** Workflow automatizado em `.github/workflows/typescript-angular-app-workflow.yaml`
* **Segurança:** Gitleaks (detecção de segredos), Semgrep (SAST), Trivy (vulnerabilidades)
* **QA & Build:** Checagem de tipos, Linting e geração de artefatos de produção

---

## 📁 Estrutura de Diretórios

```text
angular-host-react-remote/
├── .github/
│   └── workflows/
│       └── typescript-angular-app-workflow.yaml # Pipeline CI/CD GitHub Actions
├── apps/
│   ├── host/                           # Aplicação Principal (Angular 17+)
│   │   ├── src/app/
│   │   │   ├── auth/                   # Módulo de Autenticação e Login
│   │   │   ├── core/                   # Interceptors e Serviços Globais
│   │   │   └── dashboard/              # Dashboard principal consumindo Remote
│   │   └── package.json
│   └── remote/                         # Micro-frontend Remote (React 18+)
│       ├── src/                        # Componentes React exportados
│       ├── webpack.config.js           # Configuração de Module Federation Exposes
│       └── package.json
├── packages/
│   └── shared-types/                   # Tipos TypeScript compartilhados
├── turbo.json                          # Configurações de tarefas do Turborepo
├── package.json                        # Scripts globais do Monorepo
└── README.md
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js:** `>= 18.0.0`
* **npm:** `>= 9.0.0`

### 1. Instalar as dependências do Monorepo
```bash
npm ci
```

### 2. Rodar o Ambiente de Desenvolvimento (Host + Remote em paralelo)
Para iniciar as duas aplicações simultaneamente:
```bash
npm run dev
```
* **Host (Angular):** [http://localhost:4200](http://localhost:4200)
* **Remote (React):** [http://localhost:4201](http://localhost:4201)

### 3. Rodar Serviços Separadamente
* **Apenas o Host (Angular):**
  ```bash
  npm run dev:host
  ```
* **Apenas o Remote (React):**
  ```bash
  npm run dev:remote
  ```

---

## 🧪 Scripts e Pipelines de Qualidade

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor dev do Host e Remote em paralelo |
| `npm run build` | Executa o build de produção de todo o monorepo via Turborepo |
| `npm run type-check` | Executa a validação de tipos TypeScript em todos os projetos |
| `npm run lint` | Executa o linter nos códigos do monorepo |
| `npm run clean` | Limpa os caches do Turborepo e arquivos compilados |

---

## 🔄 Pipeline CI/CD (GitHub Actions)

A pipeline automatizada do projeto é dividida em **3 jobs sequenciais**:

1. **🔒 Security:**
   * **Gitleaks:** Prevenção de vazamento de chaves e segredos.
   * **Semgrep:** Análise estática de segurança do código-fonte.
   * **Trivy:** Varredura de vulnerabilidades conhecidas em dependências.
2. **🧪 QA:**
   * Execução de linter e checagem de tipos (`npm run lint`).
   * Execução de testes de cobertura.
3. **📦 Build & Drop:**
   * Compilação dos artefatos em modo produção (`npm run build`).
   * Publicação do pacote de distribuição como artefato do workflow.

---

## 📝 Licença

Este projeto é mantido como parte da arquitetura enterprise de micro-frontends.