import { useSelector } from 'react-redux';
import { authInfoSelector } from '../redux/selectors';

const useAuthInfo = () => {
  const authInfo = useSelector((state) => authInfoSelector(state));

  return {
    ...authInfo
  };
};

export default useAuthInfo;
