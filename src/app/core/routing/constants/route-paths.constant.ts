export const LIFE_CYCLE_PATH = '/life-cycle' as const;

export const CHANGE_DETECTION_SLUGS = {
  summary: 'resumo',
  zoneJs: 'zone-js',
  zoneless: 'zoneless',
} as const;

export const CHANGE_DETECTION_PATHS = {
  root: '/change-detection',
  summary: `/change-detection/${CHANGE_DETECTION_SLUGS.summary}`,
  zoneJs: `/change-detection/${CHANGE_DETECTION_SLUGS.zoneJs}`,
  zoneless: `/change-detection/${CHANGE_DETECTION_SLUGS.zoneless}`,
} as const;
