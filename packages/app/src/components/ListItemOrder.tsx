import { getPaymentStatusName } from '#data/dictionaries'
import { getDisplayStatus } from '#data/status'
import { makeOrder } from '#mocks'
import {
  Icon,
  ListItem,
  Text,
  formatDate,
  formatDisplayName,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Order } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

interface Props {
  resource?: Order
}

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

function ListItemOrderComponent({
  resource = makeOrder()
}: Props): JSX.Element {
  const { user } = useTokenProvider()

  const displayStatus = getDisplayStatus(resource)

  return (
    <ListItem
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
          {resource.market?.name} #{resource.number}
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          {formatDate({
            format: 'date',
            isoDate: resource.updated_at,
            timezone: user?.timezone
          })}
          {orderBillingAddress(resource)}
          {orderStatusText(resource)}
        </Text>
      </div>
      <div>
        <Text tag='div' weight='semibold'>
          {resource.formatted_total_amount}
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          {getPaymentStatusName(resource.payment_status)}
        </Text>
      </div>
    </ListItem>
  )
}

export const ListItemOrder = withSkeletonTemplate(ListItemOrderComponent)