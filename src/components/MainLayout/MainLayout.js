import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { createTheme, CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'

import { darkPalette, lightPalette, theme } from '../../utils/theme'
import Providers from '../../providers'
import Header from '../Header/Header'

const MainLayout = ({ children }) => {
  const lightMode = Boolean(useSelector((state) => state.lightMode.active))

  const activePalette = lightMode ? lightPalette : darkPalette
  const themeWithPalette = createTheme({ ...theme(activePalette), ...activePalette })

  return (
    <ThemeProvider theme={themeWithPalette}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Providers>
          {/* TODO: Nextjs */}
          <Header isTourOpen={false} />
          {children}
        </Providers>
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default MainLayout
