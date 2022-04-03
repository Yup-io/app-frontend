import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core/styles'
import CollectionDialog from '../Collections/CollectionDialog.js'
import { connect } from 'react-redux'
import { accountInfoSelector } from '../../redux/selectors'
import SubscribeDialog from '../SubscribeDialog/SubscribeDialog'

const styles = theme => ({
  collectionFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(5),
    zIndex: '1000',
    color: theme.palette.common.first,
    backgroundColor: theme.palette.alt.second,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
})

const CreateCollectionFab = ({ classes, account }) => {
  if (!account) return null
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  return (
    <>
      {account && account.name ? (
        <CollectionDialog
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      ) : (
        <SubscribeDialog
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
        />
      )}
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleDialogOpen}
        className={classes.collectionFab}
      >
        <AddIcon />
      </IconButton>
    </>
  )
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
