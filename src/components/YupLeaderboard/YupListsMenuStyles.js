import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  infoContainer: {
    margin: '10px auto',
    maxHeight: '200px',
    width: '100%'
  },
  rootContainer: {
    margin: '45px auto 0 auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'hidden',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      margin: '30px 16px 0'
    }
  },
  Tab: {
    minWidth: '60px'
  },
  hidden: {
    visibility: 'hidden'
  },
  minimizeTitle: {
    fontSize: '24px'
  },
  minimizeCard: {
    maxHeight: '60px',
    transition: 'max-height 0.15s linear',
    overflow: 'hidden'
  },
  filters: {
    marginTop: '15px',
    width: '100%'
  },
  search: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}));
