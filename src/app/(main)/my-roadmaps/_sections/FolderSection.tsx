import FolderList from '../_components/FolderList';

interface FolderSectionProps {
  onAddFolderClick: () => void;
}

const FolderSection = ({ onAddFolderClick }: FolderSectionProps) => {
  return <FolderList onAddFolderClick={onAddFolderClick} />;
};

export default FolderSection;
