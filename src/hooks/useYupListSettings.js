import { useRouter } from 'next/router';
import { parseSettings } from '../utils/yup-list';
import { useSelector } from 'react-redux';

const useYupListSettings = () => {
  const listOptions = useSelector((state) => state.yupListSettings.listOptions);
  const {
    query: { site, subject, category }
  } = useRouter();
  const config = { site, subject, category };

  return parseSettings(config, listOptions);
};

export default useYupListSettings;
