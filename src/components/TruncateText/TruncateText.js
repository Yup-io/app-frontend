import { TruncateTextRoot } from './styles'

const TruncateText = ({ lines, text, ...restProps }) => {
  return (
    <TruncateTextRoot lines={lines} {...restProps}>
      {text}
    </TruncateTextRoot>
  );
};

export default TruncateText;
