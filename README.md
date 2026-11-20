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

* **Ciclo de Vida de Componentes (`/life-cycle`):**
  O primeiro laboratório interativo da plataforma. Permite acompanhar em câmera lenta toda a linha do tempo de um componente — desde a alocação de memória no construtor, passando pela sincronização de inputs e projeção de conteúdo, até a montagem da view e o descarte final.

### 🟡 O que está por vir (Roadmap Futuro)

* **Detecção de Mudanças & Reatividade (Signals vs. Zone.js):**
  Visualização em câmera lenta de como o Angular rastreia dependências e propaga notificações de mudanças — comparando o modelo de dirty-checking clássico com a reatividade cirúrgica e sem overhead dos Signals.
* **Pipeline de Renderização & DOM:**
  Inspeção desacelerada do processo de reconciliação, compilação de templates e o instante exato em que os novos hooks de renderização (`afterNextRender`, `afterEveryRender`) disparam após a pintura no browser.
* **Injeção de Dependências (DI Tree):**
  Navegação visual pela árvore hierárquica de injetores (Element Injector vs. Environment Injector), demonstrando a resolução de instâncias, escopos e ciclo de vida de serviços.
* **Roteamento & Ciclo de Navegação:**
  Simulação passo a passo da navegação: correspondência de URLs, execução de guards, carregamento de resolvers e ativação de rotas com lazy loading.

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
