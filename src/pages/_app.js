import { Provider } from 'react-redux';
import '../../styles/global.css';
import MainLayout from '../components/MainLayout';
import { store } from '../redux/store';
import createEmotionCache from '../createEmotionCache';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </CacheProvider>
  );
};

export default MyApp;
