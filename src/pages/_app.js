import { Provider } from 'react-redux';
import '../../styles/global.css';
import MainLayout from '../components/MainLayout';
import { store } from '../redux/store';
import createEmotionCache from '../createEmotionCache';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query'
import { useEffect, useState } from 'react'

const clientSideEmotionCache = createEmotionCache();

// Create react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      suspense: true
    }
  }
});

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </Provider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default MyApp;
