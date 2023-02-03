import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from './ErrorBoundary'
import { DataProvider } from '../context/user'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DataProvider>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </DataProvider>
    </>
  )
}
