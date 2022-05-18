import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles'
import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'
import { fetchUserSearchResults, fetchPostSearchResults, fetchCollectionSearchResults } from '../../redux/actions'

const styles = theme => ({
  Fragment: {
    paddingRight: '200vw'
  },
  root: {
    backgroundColor: 'transparent',
    position: 'relative',
    borderRadius: '0.65rem',
    border: '0px solid #fff',
    '&:hover': {
      backgroundColor: theme.palette.M700
    },
    '&:focus': {
      backgroundColor: theme.palette.M700
    },
    justify: 'center',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    boxShadow: `20px 20px 20px 0px ${theme.palette.M100}02, -2px -2px 20px ${theme.palette.M900}04, inset 12px 3px 20px 0px ${theme.palette.M100}04, inset -3px -7px 17px 0px ${theme.palette.M800}a, 5px 5px 9px 0px ${theme.palette.M100}04, -20px -20px 12px ${theme.palette.M900}02, inset 1px 1px 6px 0px ${theme.palette.M100}02, inset -1px -1px 2px 0px ${theme.palette.M800}d`,
    color: '#fff',
    [theme.breakpoints.down('lg')]: {
      marginLeft: 0
    }
  },
  searchIcon: {
    color: theme.palette.M300,
    pointerEvents: 'none'
  },
  menuItem: {
    fontWeight: 400,
    color: 'inherit',
    margin: '0%',
    backgroundColor: theme.palette.M300,
    width: 'flex',
    '&:hover': {
      background: theme.palette.M400
    },
    [theme.breakpoints.down('sm')]: {
      padding: '5px 10px'
    }
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    borderRadius: '0.65rem',
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      fontSize: '12px'
    },
    flexWrap: 'wrap',
    '& fieldset': {
      border: 'none'
    }
  },
  inputInput: {
    color: 'inherit',
    width: '15vw',
    paddingLeft: '45px',
    transition: theme.transitions.create('width'),
    maxWidth: '1000vw',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      width: '25vw',
      paddingLeft: '35px'
    }
  },
  closeIcon: {
    color: theme.palette.M300,
    opacity: '0.7',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.M200
    }
  }
})

class SearchBar extends Component {
  state = {
    searchText: ''
  }

  componentDidMount () {
    const { postSearchResults, userSearchResults } = this.props

    this.setState({
      searchText: userSearchResults.searchText || postSearchResults.searchText
    })
  }

  handleTextFieldChange = (e) => this.setState({ searchText: e.target.value })

  handleReturnKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch()
    }
  }

  handleSearchClose = (e) => {
    const { searchPosts, searchUsers } = this.props
    this.setState({ searchText: '' })

    searchPosts('', 0)
    searchUsers('', 0)
  }

  handleSearch = async () => {
    const { searchText } = this.state
    if (searchText == null || searchText === '') return // TODO: Remove this?
    const { searchPosts, searchUsers, searchCollections, history, account } = this.props
    window.analytics && window.analytics.track('Search Query', {
      userId: (account && account.name) || 'no-logged-user',
      query: searchText,
      application: 'Web App'
    })
    searchPosts(searchText, 5)
    searchUsers(searchText, 5)
    searchCollections(searchText, 5)
    history.push('/search')
  }

  render () {
    const { classes } = this.props
    const { searchText } = this.state
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <div className={classes.container}>
            <TextField
              onChange={this.handleTextFieldChange}
              onKeyPress={this.handleReturnKeyPress}
              InputProps={{
                classes: {
                  root: classes.inputRoot,
                  input: classes.inputInput
                },
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon className={classes.searchIcon} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    {searchText && searchText.length > 0 &&
                      <CloseIcon onClick={this.handleSearchClose}
                        className={classes.closeIcon}
                      />
                    }
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
              value={searchText}
            />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { account } = state.scatterRequest
  return {
    account,
    userSearchResults: state.searchResults.userSearchResults, // userSearchResultsSelector(state),
    postSearchResults: state.searchResults.postSearchResults // postSearchResultsSelector(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchPosts: (searchText, limit) => dispatch(fetchPostSearchResults(searchText, limit)),
    searchCollections: (searchText, limit) => dispatch(fetchCollectionSearchResults(searchText, limit)),
    searchUsers: (searchText, limit) => dispatch(fetchUserSearchResults(searchText, limit))
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  searchPosts: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  searchCollections: PropTypes.func.isRequired,
  userSearchResults: PropTypes.object.isRequired,
  postSearchResults: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchBar)))
