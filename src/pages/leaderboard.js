import YupLists from '../_pages/YupLists/YupLists';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { apiGetListOptions } from '../apis/lists'
import { setListOptions } from '../redux/actions'

const Leaderboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetListOptions().then((options) => {
      dispatch(setListOptions(options));
    });
  }, []);

  return (
    <YupLists />
  );
};

export default Leaderboard;
