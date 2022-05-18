import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar-track': {
      display: 'none'
    },
    '*::-webkit-scrollbar-thumb': {
      display: 'none'
    }
  },
  root: {
    width: '100%',
    margin: 'auto'
  },
  listLoader: {
    backgroundSize: 'cover',
    width: '100%',
    minWidth: '250px',
    maxWidth: '100%',
    height: '100px',
    maxHeight: '100px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '85vw',
      marginleft: 0
    }
  },
  scrollDiv: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw'
    }
  },
  infiniteScroll: {
    width: '100%'
  },
  iconButton: {
    color: '#f2f2f2',
    maxWidth: '5vw',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hidden: {
    display: 'none'
  }
}));
