import { getPaymentStatusName } from '#data/dictionaries'
import { appRoutes } from '#data/routes'
import { getDisplayStatus } from '#data/status'
import {
  Icon,
  Legend,
  ListItem,
  Text,
  formatDate,
  formatDisplayName,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

import { useCustomerOrdersList } from 'src/hooks/useCustomerOrdersList'
import { useRoute } from 'wouter'

function orderBillingAddress(order: Order): string | undefined {
  const billingAddress = order?.billing_address
  if (billingAddress != null) {
    const billingAddressText = !isEmpty(billingAddress?.company)
      ? billingAddress?.company
      : formatDisplayName(
          billingAddress?.first_name ?? '',
          billingAddress?.last_name ?? ''
        )
    return ` · ${billingAddressText as string}`
  }
}

function orderStatusText(order: Order): JSX.Element {
  const displayStatus = getDisplayStatus(order)
  return (
    <>
      {' · '}
      {displayStatus.task != null ? (
        <Text weight='semibold' size='small' variant='warning'>
          {displayStatus.task}
        </Text>
      ) : (
        displayStatus.label
      )}
    </>
  )
}

export const CustomerLastOrders = withSkeletonTemplate((): JSX.Element => {
  const { user } = useTokenProvider()

  const [, params] = useRoute<{ customerId: string }>(appRoutes.details.path)
  const customerId = params?.customerId ?? ''
  if (customerId.length === 0) return <></>

  const { orders } = useCustomerOrdersList({
    id: customerId,
    settings: { pageSize: 5 }
  })
  const showAll = orders != null && orders?.meta.pageCount > 1
  console.log('showAll', showAll)
  // TODO: Manage show all button and orders page
  if (orders === undefined || orders?.meta.recordCount === 0) return <></>

  const ordersListItems = orders?.map((order, idx) => {
    const displayStatus = getDisplayStatus(order)
    return (
      <ListItem
        key={idx}
        tag='div'
        icon={
          <Icon
            name={displayStatus.icon}
            background={displayStatus.color}
            gap='large'
          />
        }
      >
        <div>
          <Text tag='div' weight='semibold'>
            {order.market?.name} #{order.number}
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            {formatDate({
              format: 'date',
              isoDate: order.updated_at,
              timezone: user?.timezone
            })}
            {orderBillingAddress(order)}
            {orderStatusText(order)}
          </Text>
        </div>
        <div>
          <Text tag='div' weight='semibold'>
            {order.formatted_total_amount}
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            {getPaymentStatusName(order.payment_status)}
          </Text>
        </div>
      </ListItem>
    )
  })

  return (
    <>
      <Legend title='Order history' />
      {ordersListItems}
    </>
  )
})
