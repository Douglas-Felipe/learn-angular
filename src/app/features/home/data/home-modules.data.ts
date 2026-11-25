import { UpcomingModuleCard } from '../interfaces/home.interface';

export const UPCOMING_HOME_MODULES: readonly UpcomingModuleCard[] = [
  {
    id: 'browser',
    badge: '03 • Browser',
    title: 'Renderização & DOM',
    description:
      'Visualize em qual momento a View é montada e quando os callbacks pós-pintura disparam no navegador.',
  },
  {
    id: 'di',
    badge: '04 • DI',
    title: 'Injeção de Dependências',
    description:
      'Acompanhe a busca na árvore de injetores (ElementInjector → EnvironmentInjector) até a instância ou o NullInjectorError.',
  },
  {
    id: 'signals',
    badge: '05 • Signals',
    title: 'Grafo de Reatividade',
    description:
      'Veja em câmera lenta o grafo push-pull de signal, computed, linkedSignal e effect sem recálculos duplicados.',
  },
  {
    id: 'styles',
    badge: '06 • Styles',
    title: 'View Encapsulation',
    description:
      'Veja como Emulated, ShadowDom e None geram atributos _ngcontent/_nghost e isolam seletores CSS no DOM.',
  },
  {
    id: 'directives',
    badge: '07 • Directives',
    title: 'Diretivas & hostDirectives',
    description:
      'Explore como diretivas se acoplam ao host, a ordem de host bindings/listeners e composição sem herança.',
  },
  {
    id: 'router',
    badge: '08 • Router',
    title: 'Ciclo de Navegação',
    description:
      'Simule o pipeline de rotas passo a passo: matching de URL, guards, lazy loading, resolvers e ativação no outlet.',
  },
  {
    id: 'ssr',
    badge: '09 • SSR',
    title: 'SSR & TransferState',
    description:
      'Acompanhe o HTML renderizado no servidor até o navegador e como o TransferState evita requisições HTTP duplicadas.',
  },
  {
    id: 'defer',
    badge: '10 • Defer',
    title: '@defer & Hidratação',
    description:
      'Observe a troca de @placeholder para @loading e conteúdo real com triggers de viewport, interação e hidratação incremental.',
  },
  {
    id: 'control-flow',
    badge: '11 • Control Flow',
    title: '@for, track & Reconciliação',
    description:
      'Compare track item.id vs track $index e veja quais nós reais do DOM são reutilizados, movidos ou recriados.',
  },
  {
    id: 'projection',
    badge: '12 • Projection',
    title: 'Projeção & Views Dinâmicas',
    description:
      'Veja quem é dono do ciclo de vida com ng-content, ngTemplateOutlet e criação dinâmica via ViewContainerRef.',
  },
  {
    id: 'async',
    badge: '13 • Async',
    title: 'resource() & RxJS Interop',
    description:
      'Explore estados assíncronos, cancelamento automático via AbortSignal e a ponte entre Signals e Observables.',
  },
  {
    id: 'http',
    badge: '14 • HTTP',
    title: 'Pipeline de Interceptors',
    description:
      'Acompanhe requisições atravessando interceptors funcionais na ida e na volta com retry, cache e tratamento de erro.',
  },
  {
    id: 'forms',
    badge: '15 • Forms',
    title: 'Árvore de Formulários',
    description:
      'Visualize como estados (dirty, touched, pending) e validadores síncronos e assíncronos propagam pela árvore de controles.',
  },
];
