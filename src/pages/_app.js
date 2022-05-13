import { Provider } from 'react-redux'

import '../../styles/global.css'
import store from '../redux/store'
import MainLayout from '../components/MainLayout'

const MyApp = ({ Component, pageProps }) => {

  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  )
}

export default MyApp
