import Header from '@/shared/layout/Header/Header';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
}

const DashboardHeader = ({ onSearch }: DashboardHeaderProps) => {
  return <Header breadcrumbs={['Dashboard']} onSearch={onSearch} />;
};

export default DashboardHeader;
