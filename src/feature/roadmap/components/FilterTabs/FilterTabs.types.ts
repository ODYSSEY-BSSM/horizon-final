export interface FilterTab {
  value: string;
  label: string;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabClick: (value: string) => void;
  className?: string;
}
