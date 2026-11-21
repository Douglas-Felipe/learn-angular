import { CHANGE_DETECTION_PATHS, LIFE_CYCLE_PATH } from '@routing';
import {
  ComparisonRow,
  OnPushErrorCard,
  SummaryLabCta,
} from '../interfaces/change-detection.interface';
import { TREE_NODE_IDS } from './cd-tree.data';

const TOTAL_NODES = TREE_NODE_IDS.length;

export const ONPUSH_COMMON_ERRORS: readonly OnPushErrorCard[] = [
  {
    id: 'mutation',
    tag: 'Erro 1 • Mesma referência',
    title: 'Trocar o conteúdo mantendo a mesma caixa',
    analogy:
      'Você troca o brinquedo dentro da caixa fechada, mas deixa a mesma etiqueta de código de barras por fora.',
    symptom:
      'Alterar usuario.nome = "Ana" sem criar um novo objeto mantém o mesmo endereço de memória (===). O porteiro olha a etiqueta, acha que nada mudou e não entra.',
    fixHint: 'Use referência nova ({ ...usuario, nome: "Ana" }) ou Signals.',
    exampleLink: {
      route: LIFE_CYCLE_PATH,
      label: 'Ver exemplo prático em Ciclo de Vida',
    },
  },
  {
    id: 'timeout',
    tag: 'Erro 2 • Sem aviso na portaria',
    title: 'Esquecer de avisar após setTimeout ou callback externo',
    analogy:
      'A encomenda chega pelos fundos (setTimeout / WebSocket), mas ninguém aperta o interfone da portaria.',
    symptom:
      'O valor muda na memória, mas nenhum evento de clique aconteceu e ninguém chamou markForCheck(). O DOM fica congelado no valor antigo.',
    fixHint: 'No Zone.js, chame cdr.markForCheck() — ou migre o estado para signal().',
  },
  {
    id: 'ancestors',
    tag: 'Erro 3 • Efeito dominó até a raiz',
    title: 'Acordar todo o corredor para entregar em 1 apartamento',
    analogy:
      'Para entregar uma carta no 3º andar, o porteiro precisa bater na porta da portaria, do 1º e do 2º andar no caminho.',
    symptom:
      'Com Zone.js + OnPush, markViewDirty() marca como sujos todos os componentes pais até a raiz, forçando rechecagem de ancestrais que nem mudaram.',
    fixHint: 'Zoneless + Signals atravessa pais sem checar e atualiza só o alvo.',
  },
];

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    id: 'zone-eager',
    mode: 'Zone.js + Eager',
    analogy: 'Porteiro curioso bate em todas as portas a cada barulho',
    trigger: 'Qualquer click, setTimeout, Promise ou HTTP',
    checkedScope: `Todos os componentes da árvore`,
    commonTrap: 'Desperdício de CPU reavaliando telas que não mudaram',
  },
  {
    id: 'zone-onpush',
    mode: 'Zone.js + OnPush',
    analogy: 'Placa de "Não Perturbe" que acorda apenas o corredor marcado',
    trigger: 'Evento no template, novo @Input() (===) ou markForCheck()',
    checkedScope: 'Alvo + todos os componentes pais até a raiz',
    commonTrap: 'Mutação de objeto ou setTimeout sem markForCheck() congela o DOM',
  },
  {
    id: 'zoneless-signals',
    mode: 'Zoneless + Signals (OnPush v22)',
    analogy: 'Entrega por GPS: notificação direta só para quem assinou o dado',
    trigger: 'signal.set() ou signal.update() em qualquer lugar',
    checkedScope: 'Apenas o(s) componente(s) que lê(em) o signal() no template',
    commonTrap: 'Manter ChangeDetectionStrategy.Eager anula parte da economia',
  },
];

export const SUMMARY_LAB_CTAS: readonly SummaryLabCta[] = [
  {
    id: 'zone-js',
    route: CHANGE_DETECTION_PATHS.zoneJs,
    testId: 'summary-cta-zone-js',
    badge: 'Laboratório 01 • Clássico',
    badgeClasses: 'border-ng-warning/40 bg-ng-warning/15 text-ng-warning',
    title: 'Ver na prática: Zone.js (Eager vs OnPush)',
    segments: [
      { text: `Veja o porteiro varrendo todos os ${TOTAL_NODES} nós, o ` },
      { text: 'markViewDirty()', isCode: true },
      { text: ' subindo até a raiz e o bug clássico do ' },
      { text: 'setTimeout()', isCode: true },
      { text: ' no OnPush.' },
    ],
  },
  {
    id: 'zoneless',
    route: CHANGE_DETECTION_PATHS.zoneless,
    testId: 'summary-cta-zoneless',
    badge: 'Laboratório 02 • Angular v22',
    badgeClasses: 'border-ng-success/40 bg-ng-success/15 text-ng-success',
    title: 'Ver na prática: Zoneless + Signals',
    segments: [
      { text: 'Acompanhe em câmera lenta os pais apenas dando passagem (' },
      { text: 'Traversal', isCode: true },
      { text: ') e o Signal atualizando somente os nós assinantes com 0 desperdício.' },
    ],
  },
];
