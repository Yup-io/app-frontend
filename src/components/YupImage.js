import { Suspense } from 'react';
import { useImage } from 'react-image';
import LoadingSpin from './LoadingSpin'

const YupImage = ({ src, alt, ...restProps }) => {
  const { src: imgSrc } = useImage({
    srcList: src
  });

  return (
    <Suspense fallback={<LoadingSpin />}>
      <img src={imgSrc} alt={alt} {...restProps} />
    </Suspense>
  )
};

export default YupImage;
