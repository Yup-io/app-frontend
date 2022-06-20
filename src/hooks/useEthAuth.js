import { useSelector } from 'react-redux';
import { ethAuthSelector } from '../redux/selectors';

const useEthAuth = () => {
  const ethAuth = useSelector((state) => ethAuthSelector(state));

  return {
    ...ethAuth
  };
};

export default useEthAuth;
