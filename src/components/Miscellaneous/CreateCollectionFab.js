import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import withStyles from '@mui/styles/withStyles'
import { CollectionDialog } from '../Collections'
import { connect } from 'react-redux'
import { accountInfoSelector } from '../../redux/selectors'
import AuthModal from '../../features/AuthModal'

const styles = theme => ({
  collectionFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(5),
    zIndex: '1000',
    color: theme.palette.M100,
    backgroundColor: theme.palette.M800,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})

const CreateCollectionFab = ({ classes, account }) => {
  if (!account) return null
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  return <>
    {account && account.name ? (
      <CollectionDialog
        account={account}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    ) : (
      <AuthModal
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    )}
    <IconButton
      aria-label='more'
      aria-controls='long-menu'
      aria-haspopup='true'
      onClick={handleDialogOpen}
      className={classes.collectionFab}
      size='large'>
      <AddIcon />
    </IconButton>
  </>
}

CreateCollectionFab.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    account
  }
}

export default connect(mapStateToProps)(withStyles(styles)(CreateCollectionFab))
