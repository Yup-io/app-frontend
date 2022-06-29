import { useThemeMode } from '../../contexts/ThemeModeContext';
import YupImage from '../YupImage';

const YupLogoEmoji = () => {
  const { isLightMode } = useThemeMode();

  return (
    <img
      src={`/images/logos/logo_outline_${isLightMode ? 'b' : 'w'}.svg`}
      alt="Emoji represents YUP"
      width={20}
    />
  );
};

export default YupLogoEmoji;
