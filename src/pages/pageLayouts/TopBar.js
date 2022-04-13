import React, { useEffect } from 'react'
import { withStyles, AppBar } from '@material-ui/core'
// import useScrollTrigger from '@mui/material/useScrollTrigger'
// import Slide from '@mui/material/Slide'
// import PropTypes from 'prop-types'

const styles = theme => ({
  topBar: {
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: 'none',
    [theme.breakpoints.up('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '16px 103px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 117px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '16px 24px'
    }
  }
})

// function HideOnScroll (props) {
//   const { children, window } = props
//   const trigger = useScrollTrigger({
//     target: window ? window() : undefined
//   })

//   console.log('window:', window)

//   return (
//     <Slide appear={false}
//       direction='down'
//       in={!trigger}>
//       {children}
//     </Slide>
//   )
// }

// HideOnScroll.propTypes = {
//   children: PropTypes.element.isRequired,
//   window: PropTypes.func
// }

const Scroll = () => {
  useEffect(function mount () {
    function onScroll () {
      console.log('scroll!')
    }

    window.addEventListener('scroll', onScroll)

    return function unMount () {
      window.removeEventListener('scroll', onScroll)
    }
  })

  return null
}

const TopBar = withStyles(styles)(function TopBar ({
  classes, children, props, ...restProps
}) {
  return (
    // <HideOnScroll {...props}>
    <>
      <AppBar
        position='fixed'
        className={classes.topBar}
        {...restProps}
      >
        {children}
      </AppBar>
      <Scroll />
    </>
    // </HideOnScroll>
  )
})

export default TopBar
