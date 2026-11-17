# Learn Angular 🚀

> Um espaço interativo e visual para estudar e inspecionar como o Angular moderno funciona por debaixo dos panos — da instanciação em memória à pintura final no DOM do navegador.

🔗 **Acesse a aplicação online:** [https://douglas-felipe.github.io/learn-angular/](https://douglas-felipe.github.io/learn-angular/)

---

## 📖 Visão Geral

O **Learn Angular** desacelera comportamentos que ocorrem em milissegundos no navegador para você depurar visualmente cada etapa da reatividade e renderização do framework. É ideal tanto para quem está construindo seu modelo mental do Angular moderno quanto para quem deseja revisar nuances arquiteturais no dia a dia.

### 🌟 Destaques & Funcionalidades

- **Simulador de Ciclo de Vida (Lifecycle Debugger)**:
  - Navegue passo a passo pelos 11 hooks oficiais do Angular (`constructor()`, `ngOnChanges()`, `ngOnInit()`, `ngDoCheck()`, `ngAfterContentInit()`, `ngAfterContentChecked()`, `ngAfterViewInit()`, `ngAfterViewChecked()`, `afterNextRender()`, `afterEveryRender()` e `ngOnDestroy()`).
  - Inspeção ao vivo do valor mantido **em memória** versus o que já foi **sincronizado no DOM**.
  - Árvore de execução interativa conectando subgrafos de *Creation*, *Change Detection*, *Content Projection*, *View DOM*, *Rendering* e *Destruction*.
  - Painel de código `card-demo.component.ts` com breakpoints e contexto de execução em tempo real.
  - Controles de reprodução automática (*Play/Pausar*), navegação manual (*Próximo/Anterior*) e simulação de montagem/destruição de instâncias.
- **Design System Alinhado ao angular.dev**:
  - Tema escuro por padrão com suporte a alternância Dark/Light.
  - Tipografia otimizada com `Inter` e `JetBrains Mono`.
  - Botões estilo *cyber* com microinterações fluidas e contraste aprimorado.
- **Arquitetura Moderna**:
  - Angular v22+, Standalone Components por padrão e Signals para gerenciamento de estado reativo.
  - Suíte de testes automatizados com Vitest atingindo **≥ 90% de cobertura**.
  - Pipeline de CI/CD automatizada para deploy contínuo no GitHub Pages.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Angular 22](https://angular.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testes Unitários**: [Vitest](https://vitest.dev/) + [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)
- **CI/CD**: GitHub Actions + GitHub Pages

---

## 💻 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão `20.x` ou `22.x` (LTS recomendado)
- Gerenciador de pacotes `npm`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:Douglas-Felipe/learn-angular.git
   cd learn-angular
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:4200/](http://localhost:4200/) para explorar a aplicação. As alterações no código serão recarregadas automaticamente.

---

## 🧪 Testes e Cobertura

O projeto adota a pirâmide de testes e exige alta cobertura de código em toda a lógica de domínio:

```bash
# Executa todos os testes unitários uma vez
npm test -- --watch=false

# Executa testes gerando relatório detalhado de cobertura (V8)
npm test -- --coverage --watch=false
```

---

## 🚀 Build e Deploy

Para gerar o build otimizado de produção:

```bash
# Build padrão
npm run build

# Build configurado para GitHub Pages (com base-href)
npx ng build --base-href /learn-angular/
```

As alterações enviadas para a branch `main` que afetem o código-fonte executam a pipeline em `.github/workflows/deploy.yml` e são publicadas automaticamente no GitHub Pages.
