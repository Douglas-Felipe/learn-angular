export type NavIconId = 'home' | 'lifecycle' | 'change-detection';

export interface NavChildItem {
  label: string;
  route: string;
  badge?: string;
}

export interface NavItem {
  label: string;
  route: string;
  icon?: NavIconId;
  exact?: boolean;
  description?: string;
  children?: NavChildItem[];
}
