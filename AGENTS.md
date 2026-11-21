# Regras do Workspace — Learn Angular (v22)

## 1. Angular v22, Signals e Inputs

- **Nunca ler `input.required()` no `constructor()`** (nem mesmo dentro de `untracked()`), pois gera `NG0950` antes da ligação de inputs em testes e roteamento.
- **Estado sincronizado com inputs:** usar `linkedSignal({ source: this.meuInput, computation: ... })` em vez de resetar sinais imperativamente dentro de `effect()`. Reservar `effect()` apenas para efeitos colaterais (envolvendo chamadas que não devem criar dependências com `untracked()`).
- **`ChangeDetectionStrategy.OnPush` e `standalone: true` são padrão no Angular v22+** — não declará-los explicitamente nos decorators `@Component`.

## 2. Arquitetura das Features de Laboratório

- **Separação entre dados estáticos e lógica pura:** colocar topologias, textos didáticos, snippets e mapas de classes Tailwind em `data/*.data.ts` / `data/*.config.ts` (constantes top-level, ignoradas pelo `ignoreStatic: true` do Stryker) e manter apenas funções puras testáveis em `utils/*.util.ts`.
- **Reuso obrigatório de primitivos em `src/app/shared/`:**
  - Controle de etapas e timer: usar `createStepPlayback(totalSteps, intervalMs)` ([step-playback.util.ts](src/app/shared/utils/step-playback.util.ts)), passando o `intervalMs` específico da feature e garantindo que ações manuais (`next`, `prev`, `goTo`) interrompam playback ativo.
  - Moldura de código em modo debug: usar `CodeDebuggerShell` ([code-debugger-shell.ts](src/app/shared/components/code-debugger-shell/code-debugger-shell.ts)) com projeção `[debuggerHeaderActions]` e `[debuggerClassHeader]`.
- **Rotas e tipagem estrita:**
  - Centralizar slugs e paths compartilhados em `src/app/core/routing/constants/route-paths.constant.ts` (exportados por `@routing`).
  - Evitar componentes wrapper triviais que apenas repassam um input estático: preferir `withComponentInputBinding()` com `AppRoute<TData>` genérico.
  - Como `tsconfig.json` habilita `noPropertyAccessFromIndexSignature: true`, declarar objetos de rota tipados (`const rota: AppRoute<MeuRouteData> = ...`) antes de inseri-los em `AppRoute[]` para evitar TS2353.
- **Tipagem de domínio:** modelar pares acoplados (como `mode` + `scenario`) com uniões discriminadas, tornando combinações inválidas irrepresentáveis em tempo de compilação.

## 3. Tailwind CSS v4 (`src/styles.css`)

- Toda classe utilitária/componente customizada (`.ui-btn`, `.ui-pill`, `.ng-card`, etc.) **deve ficar dentro de `@layer components`** em `src/styles.css`. Regras fora de layer sobrepõem `@layer utilities` e anulam silenciosamente classes como `rounded-xl` ou `rounded-md`.
