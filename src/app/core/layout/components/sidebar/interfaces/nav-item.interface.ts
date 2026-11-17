export type NavIconId = 'home' | 'lifecycle';

export interface NavItem {
  label: string;
  route: string;
  icon?: NavIconId;
  exact?: boolean;
  description?: string;
}
