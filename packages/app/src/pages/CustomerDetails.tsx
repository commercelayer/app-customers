import { CustomerAddresses } from '#components/CustomerAddresses'
import { CustomerInfo } from '#components/CustomerInfo'
import { CustomerLastOrders } from '#components/CustomerLastOrders'
import { CustomerStatus } from '#components/CustomerStatus'
import { CustomerTimeline } from '#components/CustomerTimeline'
import { CustomerWallet } from '#components/CustomerWallet'
import { ScrollToTop } from '#components/ScrollToTop'
import { appRoutes } from '#data/routes'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useCustomerDetails } from 'src/hooks/useCustomerDetails'
import { Link, useLocation, useRoute } from 'wouter'

export function CustomerDetails(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ customerId: string }>(appRoutes.details.path)

  const customerId = params?.customerId ?? ''

  const { customer, isLoading } = useCustomerDetails(customerId)

  if (customerId === undefined || !canUser('read', 'customers')) {
    return (
      <PageLayout
        title='Customers'
        onGoBack={() => {
          setLocation(appRoutes.filters.makePath())
        }}
        mode={mode}
      >
        <EmptyState
          title='Not authorized'
          action={
            <Link href={appRoutes.filters.makePath()}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const pageTitle = `${customer.email}`

  return (
    <PageLayout
      mode={mode}
      actionButton={<a className='hidden'>Edit</a>}
      title={
        <SkeletonTemplate isLoading={isLoading}>{pageTitle}</SkeletonTemplate>
      }
      onGoBack={() => {
        setLocation(appRoutes.listAll.makePath())
      }}
    >
      <ScrollToTop />
      <SkeletonTemplate isLoading={isLoading}>
        <Spacer bottom='4'>
          <CustomerStatus customer={customer} />
          <Spacer top='14'>
            <CustomerInfo customer={customer} />
          </Spacer>
          <Spacer top='14'>
            <CustomerLastOrders />
          </Spacer>
          <Spacer top='14'>
            <CustomerWallet customer={customer} />
          </Spacer>
          <Spacer top='14'>
            <CustomerAddresses customer={customer} />
          </Spacer>
          <Spacer top='14'>
            <CustomerTimeline customer={customer} />
          </Spacer>
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}
