'use client';

import { forwardRef } from 'react';
import { Icon, Text } from '@/shared/ui';
import { useTextField } from './TextField.hooks';
import {
  StyledAffixLeft,
  StyledAffixRight,
  StyledAffixRightButton,
  StyledHelper,
  StyledInput,
  StyledInputWrapper,
  StyledTextField,
} from './TextField.styles';
import type { TextFieldProps } from './TextField.types';

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const {
    id,
    helperId,
    value,
    isFilled,
    isFocused,
    showPassword,
    hasToggle,
    hasLeft,
    hasRight,
    resolvedType,
    leftIconResolved,
    borderColor,
    affixColor,
    onChange,
    onFocus,
    onBlur,
    togglePassword,
    restProps,
    label,
    helperText,
    error,
    rightIcon,
    width,
    containerClassName,
    labelClassName,
    helperClassName,
  } = useTextField(props);

  return (
    <StyledTextField className={containerClassName}>
      {label && (
        <Text as="label" variant="B1" color={borderColor} htmlFor={id} className={labelClassName}>
          {label}
        </Text>
      )}
      <StyledInputWrapper width={width}>
        {hasLeft && leftIconResolved && (
          <StyledAffixLeft aria-hidden>
            <Icon name={leftIconResolved} variant="SM" color={affixColor} />
          </StyledAffixLeft>
        )}
        <StyledInput
          {...restProps}
          id={id}
          ref={ref}
          type={resolvedType}
          hasError={error}
          filled={isFilled}
          isFocused={isFocused}
          hasLeft={hasLeft}
          hasRight={hasRight}
          hasToggle={hasToggle}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
          value={value}
        />
        {hasToggle ? (
          <StyledAffixRightButton
            type="button"
            onClick={togglePassword}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
          >
            <Icon
              name={showPassword ? 'visibility' : 'visibility_off'}
              variant="SM"
              color={affixColor}
            />
          </StyledAffixRightButton>
        ) : (
          rightIcon && (
            <StyledAffixRight aria-hidden>
              <Icon name={rightIcon} variant="SM" color={affixColor} />
            </StyledAffixRight>
          )
        )}
      </StyledInputWrapper>
      {helperText && (
        <StyledHelper id={helperId} className={helperClassName}>
          <Text variant="B1" color={borderColor}>
            {helperText}
          </Text>
        </StyledHelper>
      )}
    </StyledTextField>
  );
});

TextField.displayName = 'TextField';

export default TextField;
