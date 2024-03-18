import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import theme from '../theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      gcTime: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Db-tool</title>
      </Head>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
