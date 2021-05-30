import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DialogActions, SnackbarContent, Snackbar, Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { withRouter } from 'react-router'
import wallet from '../../eos/scatter/scatter.wallet.js'
import { connect } from 'react-redux'
import YupInput from '../Miscellaneous/YupInput'
import LoaderButton from '../Miscellaneous/LoaderButton'

const BACKEND_API = process.env.BACKEND_API
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
    color: '#fafafa',
    marginLeft: '2%'
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  snack: {
    justifyContent: 'center'
  }
})

const CollectionEditDialog = ({ collection, classes, dialogOpen, handleDialogClose, history, ethAuth }) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = (msg) => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')

  const fetchAuthToken = async () => {
    if (ethAuth) return ethAuth
    else {
      const { eosname, signature } = await wallet.scatter.getAuthToken()
      return { eosname, signature }
    }
  }

  const handleEditCollection = async () => {
    try {
      setIsLoadingUpdate(true)
      const authToken = await fetchAuthToken()
      if (authToken.account && authToken.account.eosname) authToken.eosname = authToken.account.eosname
      const params = { name, description, ...authToken }
      await axios.put(`${BACKEND_API}/collections/${collection._id}`, params)
      setIsLoadingUpdate(false)
      handleSnackbarOpen('Succesfully updated your collection')
      handleDialogClose()
    } catch (err) {
      handleSnackbarOpen('There was a problem updating your collection')
      console.error(err)
      setIsLoadingUpdate(false)
    }
  }

  const handleDeleteCollection = async () => {
    try {
      setIsLoadingDelete(true)
      const authToken = await fetchAuthToken()
      if (authToken.account && authToken.account.eosname) authToken.eosname = authToken.account.eosname
      const params = { ...authToken }
      await axios.delete(`${BACKEND_API}/collections/${collection._id}`, { data: params })
      history.push(`/${authToken.eosname}`)
    } catch (err) {
      handleSnackbarOpen('There was a problem deleting your collection')
      console.error(err)
      setIsLoadingDelete(false)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <SnackbarContent
          className={classes.snack}
          message={snackbarMsg}
        />
      </Snackbar>
      <Dialog open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
        PaperProps={{
          style: {
            backgroundColor: '#0A0A0A',
            borderRadius: '25px',
            boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
            width: '80%',
            padding: '1rem 0.5rem',
            maxWidth: '500px',
            color: '#fafafa'
          }
        }}
        BackdropProps={{
          style: {
            backdropFilter: 'blur(3px)'
          }
        }}
      >
        <DialogTitle className={classes.dialogTitleText}
          id='form-dialog-title'
        >
          Update {collection.name}
        </DialogTitle>
        <DialogContent>
          <YupInput
            fullWidth
            maxLength={24}
            onChange={handleNameChange}
            id='name'
<<<<<<< HEAD
            inputProps={{ maxLength: TITLE_LIMIT, borderBottomColor: '#fafafa' }}
            InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput,
                          underline: classes.inputUnderline
                        },
                        className: classes.input }}
            InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
=======
            defaultValue={collection.name}
>>>>>>> eg-collection-bug-fixes
            label='Name'
            type='text'
          />
          <YupInput
            color='#fafafa'
            maxLength={24}
            fullWidth
            id='description'
            defaultValue={collection.description}
            onChange={handleDescriptionChange}
<<<<<<< HEAD
            inputProps={{ maxLength: DESC_LIMIT }}
            InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput
                        },
                        className: classes.input }}
            InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
=======
>>>>>>> eg-collection-bug-fixes
            label='Description'
            type='text'
          />
        </DialogContent>
        <DialogActions>
          <LoaderButton onClick={handleDeleteCollection}
            fullWidth
            backgroundColor='#1a1a1a'
            buttonText='Delete'
            color='#fafafa'
            isLoading={isLoadingDelete}
          />
          <LoaderButton onClick={handleEditCollection}
            fullWidth
            backgroundColor='#00eab7'
            buttonText='Update'
            color='#fafafa'
            isLoading={isLoadingUpdate}
          />
        </DialogActions>
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  const ethAuth = state.ethAuth.account ? state.ethAuth : null
  return {
    ethAuth
  }
}

CollectionEditDialog.propTypes = {
  collection: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ethAuth: PropTypes.object
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(CollectionEditDialog)))
