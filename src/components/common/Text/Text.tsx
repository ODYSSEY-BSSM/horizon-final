import { useText } from './Text.hooks';
import { StyledText } from './Text.styles';
import type { TextProps } from './Text.types';

const Text = (props: TextProps) => {
  const { element, styledProps, children, restProps } = useText(props);

  return (
    <StyledText as={element} {...styledProps} {...restProps}>
      {children}
    </StyledText>
  );
};

export default Text;
