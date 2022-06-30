import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      margin: '2px 0px'
    }
  },
  image: {
    width: '60px',
    maxWidth: '100%',
    height: 'auto',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    objectFit: 'cover',
    [theme.breakpoints.down('lg')]: {
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '35px'
    }
  },
  nftArt: {
    maxWidth: '60px',
    maxHeight: '60px',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '20%',
    objectFit: 'cover',
    overflow: 'hidden',
    [theme.breakpoints.down('lg')]: {
      maxHeight: '35px',
      maxWidth: '35px'
    }
  },
  url: {
    textAlign: 'left',
    [theme.breakpoints.down('lg')]: {
      fontSize: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  rank: {
    fontSize: '18px',
    [theme.breakpoints.down('lg')]: {
      padding: ' 0px 10px 0px 5px',
      fontSize: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  audiusPost: {
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    }
  }
}));
