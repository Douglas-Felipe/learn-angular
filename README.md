# Learn Angular 🚀

> Um espaço técnico e interativo para estudar, revisar e inspecionar visualmente como o Angular funciona por debaixo dos panos — da instanciação em memória à pintura final no DOM do navegador.

🔗 **Acesse a aplicação online:** [https://douglas-felipe.github.io/learn-angular/](https://douglas-felipe.github.io/learn-angular/)

---

## 📖 Sobre o Projeto

Comportamentos essenciais do Angular acontecem em poucos milissegundos dentro do navegador, o que dificulta visualizar quando cada etapa do ciclo de vida é disparada e em que momento o DOM é efetivamente atualizado.

O **Learn Angular** desacelera esse fluxo, transformando o ciclo interno do framework em uma experiência visual passo a passo. O objetivo é ajudar desenvolvedores a construir um modelo mental sólido sobre reatividade, ordem de execução e sincronização entre memória e tela.

---

## 🎯 Funcionalidades Interativas

### 1. Simulador de Ciclo de Vida (Lifecycle Debugger)

Permite inspecionar a ordem exata de execução dos **11 hooks do Angular** em um componente prático de demonstração (`card-demo.component.ts`):

- **Fases do Ciclo:**
  - **Criação (`constructor`)**: momento em que a instância da classe é alocada em memória, antes de receber `input()` ou existir qualquer nó HTML.
  - **Entradas e Inicialização (`ngOnChanges`, `ngOnInit`, `ngDoCheck`)**: recepção do primeiro valor de `input()`, inicializações de lógica e checagem de mudanças.
  - **Conteúdo Projetado (`ngAfterContentInit`, `ngAfterContentChecked`)**: inicialização e verificação de nós vinculados via `<ng-content>`.
  - **Visualização do DOM (`ngAfterViewInit`, `ngAfterViewChecked`)**: instante em que o DOM próprio do componente é montado na tela e passa a exibir o texto renderizado.
  - **Pintura no Navegador (`afterNextRender`, `afterEveryRender`)**: callbacks executados logo após o browser pintar os pixels na tela, indicados para manipulações diretas ou integração com bibliotecas externas.
  - **Destruição (`ngOnDestroy`)**: fase de limpeza de timers e remoção do componente da árvore do DOM.

- **Diferenciação Visual entre Memória e DOM:**
  - Ao digitar um novo texto no simulador e disparar a atualização, o sistema mostra o novo dado guardado em **memória** enquanto o **DOM** ainda exibe o valor antigo, revelando em qual hook específico a sincronização da View é concluída.

- **Árvore de Execução e Navegação Livre:**
  - Um fluxograma oficial do ciclo do Angular permite visualizar subgrafos (*Creation*, *Change Detection*, *Content*, *View*, *Rendering* e *Destruction*).
  - É possível clicar diretamente em qualquer hook do diagrama para saltar o estado do simulador até aquela etapa.

- **Inspeção de Código com Breakpoints:**
  - Exibe o arquivo TypeScript do componente com a linha exata de depuração em destaque, mostrando parâmetros de entrada, valores de memória e estados de dirty check.

- **Controles de Simulação:**
  - **Passo a Passo**: botões para avançar (*Próximo hook*) ou voltar (*Hook anterior*).
  - **Execução Automática**: botão *Play/Pausar* com transições temporizadas.
  - **Ciclo Completo**: botões dedicados para *Montar* e *Destruir* o componente para inspecionar o comportamento de criação e descarte.

---

## 💻 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão `20.x` ou superior)
- Gerenciador de pacotes `npm`

### Execução

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:Douglas-Felipe/learn-angular.git
   cd learn-angular
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor local:**
   ```bash
   npm start
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:4200/](http://localhost:4200/) para interagir com a aplicação.
