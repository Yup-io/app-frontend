import React from 'react'
import { withStyles, AppBar } from '@material-ui/core'
// import ScrollHandler from './ScrollHandler'

const styles = theme => ({
  topBar: {
    zIndex: 5,
    background: 'transparent',
    boxShadow: `0 0 0 ${theme.palette.M100}`,
    borderBottom: `0 solid ${theme.palette.M100}`,
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
  // none: {
  //   backdropFilter: 'none'
  // },
  // blur: {
  //   backdropFilter: 'blur(2px)'
  // }
})

const TopBar = withStyles(styles)(function TopBar ({
  classes, children, props, ...restProps
}) {
  // const [backdrop, setBackdrop] = useState('none')
  // const ref = useRef()
  // ref.current = backdrop

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 2) {
  //       setBackdrop('blur')
  //     } else {
  //       setBackdrop('none')
  //     }
  //   }
  //   document.addEventListener('scroll', handleScroll)

  //   return () => {
  //     document.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  return (
    // <ScrollHandler>
    <AppBar
      position='fixed'
      className={classes.topBar}
      {...restProps}
    >
      {children}
    </AppBar>
    // </ScrollHandler>
  )
})

export default TopBar
