import { useSelector } from 'react-redux'
import { accountInfoSelector } from '../redux/selectors'

const useAuth = () => {
  const account = useSelector((state) => accountInfoSelector(state));

  return {
    isLoggedIn: Boolean(account?.name),
    ...account
  }
};

export default useAuth;
