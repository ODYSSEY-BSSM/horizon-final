'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { FormStepProps } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import { ROADMAP_GRADIENTS } from '../../../_components/RoadmapCard';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';

const StyleStep: React.FC<FormStepProps> = ({ data, onUpdate }) => {
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const iconDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setColorDropdownOpen(false);
      }
      if (iconDropdownRef.current && !iconDropdownRef.current.contains(event.target as Node)) {
        setIconDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedColor =
    COLOR_OPTIONS.find((option) => option.value === data.color) || COLOR_OPTIONS[0];
  const selectedIcon = ICON_OPTIONS.find((option) => option.value === data.icon) || ICON_OPTIONS[0];

  const handleColorSelect = (color: string) => {
    onUpdate({ color });
    setColorDropdownOpen(false);
  };

  const handleIconSelect = (icon: string) => {
    onUpdate({ icon });
    setIconDropdownOpen(false);
  };

  const getGradient = (colorValue: string): string => {
    const gradientKey = colorValue as keyof typeof ROADMAP_GRADIENTS;
    const config = ROADMAP_GRADIENTS[gradientKey] || ROADMAP_GRADIENTS.red;
    return `linear-gradient(135deg, ${config.start} 0%, ${config.end} 100%)`;
  };

  // Inline styles
  const styleContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.large,
  };

  const thumbnailPreview = (color: string): React.CSSProperties => ({
    width: '100%',
    height: '148px',
    borderRadius: tokens.radius.medium,
    background: getGradient(color),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  });

  const thumbnailIcon: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: tokens.radius.medium,
  };

  const styleSelectors: React.CSSProperties = {
    display: 'flex',
    gap: tokens.spacing.medium,
    width: '100%',
  };

  const dropdownContainer: React.CSSProperties = {
    position: 'relative',
    flex: 1,
  };

  const dropdownHeader = (isOpen: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '48px',
    padding: `${tokens.spacing.small} ${tokens.spacing.medium}`,
    backgroundColor: tokens.colors.white,
    border: isOpen
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[300]}`,
    borderRadius: tokens.radius.medium,
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  });

  const dropdownList = (isOpen: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.white,
    border: `1px solid ${tokens.colors.neutral[200]}`,
    borderRadius: tokens.radius.medium,
    boxShadow: tokens.shadow[0],
    zIndex: 1001,
    maxHeight: '240px',
    overflowY: 'auto',
    display: isOpen ? 'block' : 'none',
    marginTop: '4px',
  });

  const colorOption = (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.small,
    height: '48px',
    padding: `${tokens.spacing.small} ${tokens.spacing.small}`,
    backgroundColor: selected ? tokens.colors.primary[100] : tokens.colors.white,
    border: 'none',
    borderBottom: `1px solid ${tokens.colors.neutral[100]}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    textAlign: 'left',
  });

  const colorSwatch = (color: string): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: color,
    flexShrink: 0,
  });

  const iconOption = (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.small,
    height: '48px',
    padding: tokens.spacing.small,
    backgroundColor: selected ? tokens.colors.primary[100] : tokens.colors.white,
    border: 'none',
    borderBottom: `1px solid ${tokens.colors.neutral[100]}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    textAlign: 'left',
  });

  const iconContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    flexShrink: 0,
  };

  return (
    <div style={styleContainer}>
      <div style={thumbnailPreview(data.color || 'red')}>
        <div style={thumbnailIcon}>
          <Icon
            name={data.icon || 'language'}
            variant="LG"
            color={tokens.colors.white}
            filled
            decorative
          />
        </div>
      </div>

      <div style={styleSelectors}>
        {/* Color Selector */}
        <div style={dropdownContainer} ref={colorDropdownRef}>
          <Text
            as="label"
            variant="B1"
            color={tokens.colors.neutral[500]}
            style={{ marginBottom: tokens.spacing.small, display: 'block' }}
          >
            컬러
          </Text>
          <button
            type="button"
            style={dropdownHeader(colorDropdownOpen)}
            onClick={() => {
              setColorDropdownOpen(!colorDropdownOpen);
              setIconDropdownOpen(false);
            }}
            aria-label="색상 선택"
            aria-expanded={colorDropdownOpen}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.small }}>
              <div style={colorSwatch(selectedColor.color)} />
              <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {selectedColor.label}
              </Text>
            </div>
            <Icon
              name={colorDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              variant="SM"
              color={tokens.colors.neutral[600]}
              decorative
            />
          </button>

          <div style={dropdownList(colorDropdownOpen)}>
            <div>
              {COLOR_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  style={colorOption(data.color === option.value)}
                  onClick={() => handleColorSelect(option.value)}
                >
                  <div style={colorSwatch(option.color)} />
                  <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                    {option.label}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Selector */}
        <div style={dropdownContainer} ref={iconDropdownRef}>
          <Text
            as="label"
            variant="B1"
            color={tokens.colors.neutral[500]}
            style={{ marginBottom: tokens.spacing.small, display: 'block' }}
          >
            아이콘
          </Text>
          <button
            type="button"
            style={dropdownHeader(iconDropdownOpen)}
            onClick={() => {
              setIconDropdownOpen(!iconDropdownOpen);
              setColorDropdownOpen(false);
            }}
            aria-label="아이콘 선택"
            aria-expanded={iconDropdownOpen}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.medium }}>
              <div style={iconContainer}>
                <Icon
                  name={selectedIcon.icon}
                  variant="SM"
                  color={tokens.colors.black}
                  filled
                  decorative
                />
              </div>
              <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {selectedIcon.label}
              </Text>
            </div>
            <Icon
              name={iconDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              variant="SM"
              color={tokens.colors.neutral[600]}
              decorative
            />
          </button>

          <div style={dropdownList(iconDropdownOpen)}>
            <div style={{ maxHeight: '264px', overflowY: 'auto' }}>
              {ICON_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  style={iconOption(data.icon === option.value)}
                  onClick={() => handleIconSelect(option.value)}
                >
                  <div style={iconContainer}>
                    <Icon
                      name={option.icon}
                      variant="SM"
                      color={tokens.colors.black}
                      filled
                      decorative
                    />
                  </div>
                  <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                    {option.label}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleStep;
