import { getPaymentStatusName } from '#data/dictionaries'
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
import type { Customer, Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

import { useCustomerOrdersDetails } from 'src/hooks/useCustomerOrdersDetails'

interface Props {
  customer: Customer
}

function getOrderBillingAddressText(order: Order): string | undefined {
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

function getOrderStatusText(order: Order): JSX.Element {
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

export const CustomerLastOrders = withSkeletonTemplate<Props>(
  ({ customer }): JSX.Element => {
    const { user } = useTokenProvider()

    const ordersLimit = 5

    const needShowAll =
      customer?.orders != null && customer?.orders?.length > ordersLimit
    console.log('needShowAll', needShowAll)
    // TODO: Manage the ShowAll case

    if (customer?.id === undefined) return <></>

    const { orders } = useCustomerOrdersDetails(customer?.id, { pageSize: 5 })

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
              {getOrderBillingAddressText(order)}
              {getOrderStatusText(order)}
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
  }
)
