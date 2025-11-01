export interface FilterTab {
  value: string;
  label: string;
}

export interface FilterTabsProps {
  activeTab: string;
  onTabClick: (value: string) => void;
}
