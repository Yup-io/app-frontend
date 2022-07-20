import ReactPlayer from 'react-player/lazy';
import YupImage from '../YupImage';
import { FlexBox } from '../styles';

const NotificationMedia = ({ url }) => {
  const isVideo = url?.includes('nft.mp4');

  return (
    <FlexBox width={50} justifyContent="center">
      {isVideo ? (
        <ReactPlayer
          url={url}
          playing
          muted
          loop
          playsinline
          style={{
            maxWidth: '100%',
            height: 50
          }}
        />
      ) : (
        <YupImage
          src={url}
          style={{
            maxWidth: '100%',
            height: 50,
            borderRadius: 8
          }}
        />
      )}
    </FlexBox>
  );
};

export default NotificationMedia;
