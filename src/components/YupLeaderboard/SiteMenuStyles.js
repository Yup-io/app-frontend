import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
  formControl: {
    width: 155,
    [theme.breakpoints.down('sm')]: {
      width: 115
    }
  }
}));
