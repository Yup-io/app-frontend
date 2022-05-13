import { useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'

const useDevice = () => {
  const theme = useTheme()

  return {
    isMobile: useMediaQuery(theme.breakpoints.down('sm'))
  }
}

export default useDevice
