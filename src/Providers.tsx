import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from 'utils/web3React'
import { HelmetProvider } from 'react-helmet-async'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider } from 'components/Base/Modal'
import { ToastsProvider } from 'contexts/ToastsContext'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <HelmetProvider>
            <RefreshContextProvider>
              <ModalProvider>{children}</ModalProvider>
            </RefreshContextProvider>
          </HelmetProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
