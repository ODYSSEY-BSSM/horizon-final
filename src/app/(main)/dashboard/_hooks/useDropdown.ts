import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDropdownProps {
  itemCount: number;
  onSelect?: (index: number) => void;
}

export const useDropdown = ({ itemCount, onSelect }: UseDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % itemCount);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex !== -1) {
            onSelect?.(highlightedIndex);
            closeDropdown();
          }
          break;
        case 'Escape':
          closeDropdown();
          break;
        default:
          break;
      }
    },
    [isOpen, highlightedIndex, itemCount, onSelect, closeDropdown],
  );

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    handleToggle,
    highlightedIndex,
    handleKeyDown,
  };
};
