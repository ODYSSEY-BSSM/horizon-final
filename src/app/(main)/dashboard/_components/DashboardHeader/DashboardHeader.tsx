import Header from '@/components/layout/Header/Header';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
}

export default function DashboardHeader({ onSearch }: DashboardHeaderProps) {
  return <Header breadcrumbs={['Dashboard']} onSearch={onSearch} />;
}
