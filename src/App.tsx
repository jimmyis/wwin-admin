import { lazy, memo } from 'react'
import { Router, Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom'
import history from 'routerHistory'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import PageLoader from './components/Loader/PageLoader'
import DefaultLayout from './Layout/Default'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { ToastListener } from './contexts/ToastsContext'

// Route-based code splitting
const Mint = lazy(() => import('./views/Mint'))
const Redeem = lazy(() => import('./views/Redeem'))
// const Reserve = lazy(() => import('./views/Reserve'))

export function RedirectPathToMintOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/mint' }} />
}

const App: React.FC = () => {
  useEagerConnect()
  usePollBlockNumber()

  return (
    <Router history={history}>
      <DefaultLayout>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            {/* <Route path="/" strict exact>
              <Reserve />
            </Route> */}
            <Route path="/mint" strict exact>
              <Mint />
            </Route>
            <Route path="/redeem" strict exact>
              <Redeem />
            </Route>

            {/* Redirect Default to Mint page */}
            <Route component={RedirectPathToMintOnly} />
          </Switch>
        </SuspenseWithChunkError>
      </DefaultLayout>
      <ToastListener />
    </Router>
  )
}

export default memo(App)
