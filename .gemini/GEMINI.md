You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Design System & UI Standards (angular.dev)

- Follow the official **angular.dev** dark-mode aesthetic defined in `src/styles.css`:
  - **Surfaces & Borders**: Use `bg-ng-bg` (`#0f0f11`), `bg-ng-surface` (`#16161a`), `bg-ng-code` (`#111115`), and `border-ng-border` (`#282730`), leveraging `.ng-card`, `.ng-gradient-text`, `.ng-gradient-bar`, and `.ng-gradient-btn`.
  - **Typography**: Use `font-sans` (`Inter`) for body/UI copy, `font-display` (`Inter Tight`) for headings (`h1`–`h3`), and `font-mono` (`DM Mono`) for code snippets, lifecycle hooks, and technical badges.
  - **Border Radius**: Keep border radii tight and geometric to match `angular.dev`:
    - Use `rounded-md` (`6px`) for cards, panels, subgraphs, and code blocks.
    - Use `rounded` (`4px`) for buttons, inputs, step pills, badges, and navigation links (`rounded-sm` for thin decorative bars or tree connectors).
    - Reserve `rounded-full` strictly for small circular status/indicator dots (`h-1.5` to `h-2.5`). Do NOT use `rounded-lg`, `rounded-xl`, `rounded-2xl`, or pill-shaped `rounded-full` on buttons, badges, or containers.
