import { appRoutes } from '#data/routes'
import {
  A,
  Legend,
  Spacer,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import { Link, useRoute } from 'wouter'

import { useCustomerOrdersList } from '#hooks/useCustomerOrdersList'
import { ListItemOrder } from './ListItemOrder'

export const CustomerLastOrders = withSkeletonTemplate((): JSX.Element => {
  const [, params] = useRoute<{ customerId: string }>(appRoutes.details.path)
  const customerId = params?.customerId ?? ''
  if (customerId.length === 0) return <></>

  const { orders } = useCustomerOrdersList({
    id: customerId,
    settings: { pageSize: 5 }
  })
  if (orders === undefined || orders?.meta.recordCount === 0) return <></>

  const showAll = orders != null && orders?.meta.pageCount > 1
  const ordersListItems = orders?.map((order, idx) => {
    return <ListItemOrder resource={order} key={idx} />
  })

  return (
    <>
      <Legend title={`Orders · ${orders?.meta?.recordCount}`} />
      {ordersListItems}
      {showAll && (
        <Spacer top='4' bottom='4'>
          <Link href={appRoutes.orders.makePath(customerId)}>
            <A>View all orders</A>
          </Link>
        </Spacer>
      )}
    </>
  )
})
