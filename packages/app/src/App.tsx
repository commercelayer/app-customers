import { CustomerDetails } from '#pages/CustomerDetails'
import { CustomerEdit } from '#pages/CustomerEdit'
import { CustomerList } from '#pages/CustomerList'
import { CustomerNew } from '#pages/CustomerNew'
import { CustomerOrders } from '#pages/CustomerOrders'
import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Filters } from '#pages/Filters'
import {
  CoreSdkProvider,
  ErrorBoundary,
  PageSkeleton,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Redirect, Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)

export function App(): JSX.Element {
  const basePath =
    import.meta.env.PUBLIC_PROJECT_PATH != null
      ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
      : undefined

  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          appSlug='customers'
          kind='customers'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          devMode={isDev}
          loadingElement={<PageSkeleton />}
          organizationSlug={import.meta.env.PUBLIC_SELF_HOSTED_SLUG}
        >
          <CoreSdkProvider>
            <Router base={basePath}>
              <Switch>
                <Route path={appRoutes.home.path}>
                  <Redirect to={appRoutes.list.path} />
                </Route>
                <Route path={appRoutes.list.path}>
                  <CustomerList type='all' />
                </Route>
                <Route path={appRoutes.filters.path}>
                  <Filters />
                </Route>
                <Route path={appRoutes.new.path}>
                  <CustomerNew />
                </Route>
                <Route path={appRoutes.details.path}>
                  <CustomerDetails />
                </Route>
                <Route path={appRoutes.edit.path}>
                  <CustomerEdit />
                </Route>
                <Route path={appRoutes.orders.path}>
                  <CustomerOrders />
                </Route>
                <Route>
                  <ErrorNotFound />
                </Route>
              </Switch>
            </Router>
          </CoreSdkProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
