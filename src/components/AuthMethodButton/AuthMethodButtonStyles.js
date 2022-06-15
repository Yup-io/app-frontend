import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5, 2.5)
  },
  icon: {
    width: 20,
    float: 'right'
  },
  text: {
    fontSize: 16,
    width: '100%',
    textAlign: 'left'
  }
}));
