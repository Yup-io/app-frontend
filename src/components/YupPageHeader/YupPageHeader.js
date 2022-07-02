import { useResizeDetector } from 'react-resize-detector';
import { YupPageHeaderRoot } from './styles';
import { useEffect } from 'react';

const YupPageHeader = ({ children, onChangeHeight, ...restProps }) => {
  const { height, ref } = useResizeDetector();

  useEffect(() => {
    if (onChangeHeight) {
      onChangeHeight(height);
    }
  }, [height]);

  return (
    <YupPageHeaderRoot ref={ref} {...restProps}>
      {children}
    </YupPageHeaderRoot>
  );
};

export default YupPageHeader;
