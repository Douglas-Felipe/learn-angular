# Learn Angular 🚀

> Um laboratório interativo para aprender e dominar o Angular moderno em **câmera lenta** — visualizando passo a passo o que acontece por debaixo dos panos, do estado em memória até a renderização no navegador.

🔗 **Acesse a aplicação online:** [https://douglas-felipe.github.io/learn-angular/](https://douglas-felipe.github.io/learn-angular/)

---

## 📖 O que é o Learn Angular?

Aprender Angular muitas vezes pode parecer lidar com uma "caixa preta": em uma aplicação real, eventos, reatividade, detecção de mudanças e renderizações acontecem em questão de milissegundos dentro do navegador. Quando algo se comporta de forma inesperada, é difícil discernir exatamente o que o framework está fazendo em cada instante.

O **Learn Angular** nasceu para transformar esse aprendizado em uma experiência tangível e visual. Em vez de apenas ler documentações teóricas, a plataforma permite **desacelerar o framework** e assistir a cada engrenagem funcionando no seu próprio ritmo, como se estivéssemos utilizando uma câmera de alta velocidade apontada para o runtime do Angular.

O objetivo principal é ajudar desenvolvedores a construir um **modelo mental sólido**, entendendo com clareza:
- Como e quando o framework processa estados e eventos;
- A diferença exata entre os dados que residem em **memória** e o que está refletido no **DOM**;
- Por que certos padrões de arquitetura funcionam melhor e quais armadilhas comuns evitar.

---

## 🧭 O Angular em Câmera Lenta

A filosofia do site baseia-se em três pilares essenciais:

1. **Depuração Visual e Interativa:** Controle total sobre o tempo da aplicação — avance passo a passo, pause a execução ou volte para estados anteriores para dissecar cada evento.
2. **Memória vs. DOM:** Visualização simultânea do estado dos objetos em JavaScript e da árvore real de elementos HTML, tornando visível o momento exato em que a reconciliação e a pintura gráfica acontecem.
3. **Inspeção de Código em Tempo Real:** Rastreamento lado a lado do código TypeScript/Template em execução e os efeitos gerados na interface.

---

## 🗺️ Módulos da Plataforma & Roadmap

A plataforma é modular e foi desenhada para cobrir os conceitos fundamentais e avançados do Angular:

### 🟢 Módulos Disponíveis

* **01 • Ciclo de Vida de Componentes (`/life-cycle`):**
  O primeiro laboratório interativo da plataforma. Permite acompanhar em câmera lenta toda a linha do tempo de um componente — desde a alocação de memória no construtor, passando pela sincronização de inputs e projeção de conteúdo, até a montagem da view e o descarte final.
* **02 • Detecção de Mudanças (`/change-detection`):**
  Comparação interativa entre **Zone.js (Clássico)** e **Zoneless + Signals**, mostrando em câmera lenta como `Default` (Eager) e `OnPush` percorrem a árvore de componentes, além de um guia com resumo e analogias dos erros mais comuns.

### 🟡 O que está por vir (Roadmap Futuro)

* **03 • Renderização & DOM:**
  Inspeção desacelerada de quando a View é montada e quando os callbacks pós-pintura (`afterNextRender`, `afterEveryRender`) disparam no navegador.
* **04 • Injeção de Dependências (DI Tree):**
  Navegação visual pela árvore hierárquica de injetores (`ElementInjector` → `EnvironmentInjector`) mostrando a resolução de instâncias, escopos, modificadores e o `NullInjectorError`.
* **05 • Grafo de Reatividade (Signals):**
  Visualização passo a passo do grafo *push-pull* de `signal`, `computed`, `linkedSignal` e `effect`, evidenciando marcação de sujeira, avaliação *lazy* e execução livre de recálculos duplicados.
* **06 • View Encapsulation (Styles):**
  Inspeção de como `Emulated`, `ShadowDom` e `None` geram atributos `_ngcontent` e `_nghost` e isolam seletores CSS no DOM.
* **07 • Diretivas & `hostDirectives`:**
  Visualização de como diretivas se acoplam ao elemento host, a ordem de execução de `host` bindings/listeners e composição sem herança.
* **08 • Ciclo de Navegação & Lazy Loading (Router):**
  Simulação do pipeline de rotas em câmera lenta: *matching* de URLs, execução de guards, download de chunks *lazy*, `resolvers` e ativação no `<router-outlet>`.
* **09 • SSR & `TransferState`:**
  Acompanhamento do HTML renderizado no servidor até o navegador e como o `TransferState` evita requisições HTTP duplicadas na inicialização.
* **10 • `@defer` & Hidratação Incremental:**
  Transição visual entre `@placeholder`, `@loading` e o componente real com triggers (`on viewport`, `on interaction`), mostrando como a hidratação incremental desperta apenas o necessário.
* **11 • `@for`, `track` & Reconciliação de Listas:**
  Comparação prática entre `track item.id` e `track $index` para revelar em tempo real quais nós do DOM são reutilizados, movidos ou destruídos e recriados.
* **12 • Projeção (`ng-content`) & Views Dinâmicas:**
  Diferença visual entre a árvore lógica e a árvore do DOM usando `<ng-content>`, `ngTemplateOutlet` e inserção imperativa com `ViewContainerRef`.
* **13 • `resource()` & Interop com RxJS:**
  Acompanhamento de estados assíncronos (`idle`, `loading`, `resolved`, `error`), cancelamento automático via `AbortSignal` e a ponte `toSignal` / `toObservable`.
* **14 • Pipeline de Interceptors HTTP:**
  Inspeção de requisições atravessando interceptors funcionais na ida (`next(req)`) e na volta da resposta, incluindo *retry*, cache e tratamento centralizado de erros.
* **15 • Árvore de Formulários & Validação:**
  Visualização de como estados (`dirty`, `touched`, `pending`) e validadores síncronos e assíncronos propagam do controle individual até o formulário raiz.

---

## 🛠️ Tecnologias

- **[Angular](https://angular.dev/):** Standalone components, Signals, control flow e arquitetura moderna.
- **[Tailwind CSS](https://tailwindcss.com/):** Estilização utilitária com design system consistente e responsivo.
- **[Vitest](https://vitest.dev/):** Suíte rápida e moderna para testes automatizados unitários e de componentes.
- **[Stryker Mutator](https://stryker-mutator.io/):** Testes de mutação com threshold mínimo obrigatório de **90%** no desenvolvimento e no CI/CD.

---

## 💻 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão `20.x` ou superior)
- Gerenciador de pacotes `npm`

### Instalação e Execução

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
   Abra [http://localhost:4200/](http://localhost:4200/) para explorar a aplicação.

5. **Executar os testes unitários e cobertura:**
   ```bash
   npm test
   npm run test:coverage
   ```

6. **Executar os testes de mutação (score mínimo de 90%):**
   ```bash
   # Execução completa
   npm run test:mutation

   # Execução incremental (para o desenvolvimento)
   npm run test:mutation:incremental
   ```
   O relatório detalhado em HTML é gerado em `reports/mutation/mutation.html`.
