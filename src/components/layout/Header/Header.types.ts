export interface HeaderProps {
  className?: string;
  breadcrumbs?: string[];
  onSearch?: (query: string) => void;
}

export interface BreadcrumbNavigationProps {
  items: string[];
}

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}
