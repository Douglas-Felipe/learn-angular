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

- Follow the **angular.dev** Developer Experience (DX) and technical documentation design system defined in `src/styles.css`:
  - **Theme & Surfaces**: Default to Dark Mode using deep obsidian backgrounds (`#0F0F11`), elevated charcoal cards (`#18181B`), and glassmorphic sticky headers (`rgba(15, 15, 17, 0.75)` with `backdrop-filter: blur(12px)` via `.ng-glass-header`). Support Light Mode with `#FFFFFF` backgrounds and `#F8F9FA` sidebars (`.ng-sidebar-surface`).
  - **Color Accents**: Use the signature gradient (`linear-gradient(135deg, #F0060B 0%, #CC26D5 50%, #7702FF 100%)`) sparingly for hero keyword highlights (`.ng-gradient-text` with `background-clip: text`), primary pill CTAs (`.ng-pill-cta`), and active border glows (`.ng-active-glow`). Use electric purple (`#8514F5`) and crimson (`#DD0031`) for active states and links.
  - **Borders & Depth**: Avoid heavy drop shadows. Define hierarchy with crisp `1px solid` subtle borders (`rgba(255, 255, 255, 0.08)` in dark mode, `#E4E4E7` in light mode) and soft ambient radial background glows (`blur(120px)`, low opacity via `.ng-ambient-glow`).
  - **Typography**: Use `Inter` (`font-sans` / `font-display`) for UI and headings with tight `-0.03em` tracking (`.display-title`) on display titles and `1.65` line-height on body text. Use `JetBrains Mono` (`font-mono`) for code blocks, CLI commands, keyboard shortcuts, and technical badges.
  - **Components & Geometry**:
    - Use `12px` border-radius (`rounded-xl`, `.ng-card`, `.ng-code-container`) for cards and code containers with subtle border-color transitions on hover (`.ng-card-interactive`).
    - Use `8px` border-radius (`rounded-lg`, `.ui-btn`) for standard buttons, inputs, and navigation links.
    - Use `9999px` pill shape (`rounded-full`, `.ng-pill-cta`) for primary hero/transport CTAs and small circular status dots.
    - Include file-name headers and copy buttons on interactive code blocks.
