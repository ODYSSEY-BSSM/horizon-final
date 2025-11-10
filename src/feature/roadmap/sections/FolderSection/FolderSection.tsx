import { FolderList } from '@/feature/roadmap';

interface FolderSectionProps {
  onAddFolderClick: () => void;
}

const FolderSection = ({ onAddFolderClick }: FolderSectionProps) => {
  return <FolderList onAddFolderClick={onAddFolderClick} />;
};

export default FolderSection;
