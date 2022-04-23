import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, Grid, DialogContent, DialogTitle, Typography, Icon } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx'

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogTitleText: {
    fontSize: '1.3rem',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: theme.palette.M100
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: theme.palette.M100
    }
  },
  dialogContentText: {
    root: {
      paddingBottom: '2rem',
      paddingTop: '2rem'
    }
  },
  firstButton: {
    flexGrow: 1
  }
})
function YupDialog (props) {
  const { classes, firstButton, secondButton, buttonPosition, headline, description, children, ...restProps } = props
  const full = buttonPosition === 'full'
  const reverse = buttonPosition === 'right'
  return (
    <Dialog
      {...restProps}
    >

      <DialogTitle
        style={{ paddingBottom: '10px' }}
      >
        <Typography variant='h5'>
          {headline}
        </Typography>
        {restProps.onClose ? (
          <IconButton
            aria-label='close'
            onClick={restProps.onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
            size="large">
            <Icon fontSize='small'
              className='fal fa-close'
            />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Grid container
          direction='column'
          spacing={2}>
          <Grid item>
            <Typography variant='b2'>{description}</Typography>
          </Grid>
          <Grid item>
            {children}
          </Grid>
          <Grid item>
            <Grid
              container
              xs={12}
              spacing={firstButton && secondButton && 2}
              direction={reverse ? 'row-reverse' : 'row'}
              alignItems='stretch'
            >
              {firstButton && (
                <Grid
                  item
                  className={clsx(full && classes.firstButton)}
                >
                  {firstButton}
                </Grid>)}

              {secondButton && (
                <Grid item xs={full && 6}>
                  {secondButton}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

    </Dialog>
  );
}

YupDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  firstButton: PropTypes.object,
  secondButton: PropTypes.object,
  buttonPosition: PropTypes.string,
  headline: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.object,
  handleDialogClose: PropTypes.func

}

export default (withStyles(styles)(YupDialog))
