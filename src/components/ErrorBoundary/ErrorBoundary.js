import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rollbar from '../../utils/rollbar'

const parseErr = (err) => typeof err === 'object' ? JSON.stringify(err) : err
class ErrorBoundary extends Component {
  state = {
    error: false
  }
  componentDidCatch (error, errorInfo) {
    this.setState({
      error: error
    })
    console.log('Error boundary', errorInfo)
    rollbar.error(`WEBAPP: Error boundary error=${error} errorInfo=${parseErr(errorInfo)}`)
  }
  render () {
    if (this.state.error) {
      return (
        <div />
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
}

export default ErrorBoundary
