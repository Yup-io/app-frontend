import { Provider } from 'react-redux'

import '../../styles/global.css'
import MainLayout from '../components/MainLayout'
import { store } from '../redux/store'

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  )
}

export default MyApp;
