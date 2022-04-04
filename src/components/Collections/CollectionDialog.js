import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DialogActions, SnackbarContent, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, Link, Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { connect } from 'react-redux'
import { addUserCollection } from '../../redux/actions'
import { YupInput, LoaderButton } from '../Miscellaneous'
import { accountInfoSelector } from '../../redux/selectors'
import { getAuth } from '../../utils/authentication'

const BACKEND_API = process.env.BACKEND_API
const WEB_APP_URL = process.env.WEB_APP_URL
const TITLE_LIMIT = 30
const DESC_LIMIT = 140

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('sm')]: {
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
  snack: {
    justifyContent: 'center'
  }
})

const CollectionDialog = ({ postid, classes, dialogOpen, handleDialogClose, addCollectionToRedux, account }) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newCollectionInfo, setNewCollectionInfo] = useState({})

  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = msg => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !!name) handleCreateNewCollection()
  }

  const handleCreateNewCollection = async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const postId = postid === 'routeFromUrl' ? undefined : postid
      const auth = await getAuth(account)
      const params = { name, description, postId, eosname: account.name, ...auth }
      const { data } = await axios.post(`${BACKEND_API}/collections`, params)
      addCollectionToRedux(auth.eosname || account.name, data)
      setNewCollectionInfo(data)
      handleSnackbarOpen(`Succesfully created ${name}`)
      handleDialogClose()
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      handleSnackbarOpen(`There was a problem creating your collection`)
      console.error(err)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <Link
          href={`${WEB_APP_URL}/collections/${encodeURIComponent(
            newCollectionInfo.name
          )}/${newCollectionInfo._id}`}
        >
          <SnackbarContent className={classes.snack}
            message={snackbarMsg}
          />
        </Link>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onKeyDown={handleKeyDown}
        aria-labelledby='form-dialog-title'
        maxWidth='xs'
      >
        <DialogTitle className={classes.dialogTitleText}
          id='form-dialog-title'
        >
          <Typography variant='h5'>New Collection</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2'>
            Start here to make a new collection. You can add any content, person, URL, address, NFT or anything else.
          </DialogContentText>
          <Grid
            container
            direction='column'
            alignItems='stretch'
            spacing={3}
          >
            <Grid item>
              <YupInput
                fullWidth
                id='name'
                maxLength={TITLE_LIMIT}
                multiline
                label='Name'
                onChange={handleNameChange}
                type='text'
                variant='outlined'
                size='small'
              />
            </Grid>
            <Grid item>
              <YupInput
                fullWidth
                id='description'
                maxLength={DESC_LIMIT}
                label='Description'
                multiline
                rows={2}
                onChange={handleDescriptionChange}
                type='textarea'
                variant='outlined'
                size='small'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoaderButton onClick={handleCreateNewCollection}
            fullWidth
            buttonText='Create Collection'
            isLoading={isLoading}
            variant='contained'
            color='secondary'
          />
        </DialogActions>
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    account
  }
}

const mapActionToProps = (dispatch) => {
  return {
    addCollectionToRedux: (eosname, collection) => dispatch(addUserCollection(eosname, collection))
  }
}

CollectionDialog.propTypes = {
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  addCollectionToRedux: PropTypes.func.isRequired,
  account: PropTypes.object
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(CollectionDialog))
