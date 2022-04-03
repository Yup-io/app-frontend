import React from 'react'
import { useScrollTrigger } from '@material-ui/core'

const ScrollHandler = props => {
  const { children } = props

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  })

  return React.cloneElement(children, {
    style: {
      backdropFilter: trigger ? 'blur(2px)' : 'none'
    }
  })
}

export default ScrollHandler
