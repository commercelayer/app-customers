import { makeCustomer } from '#mocks'
import {
  AvatarLetter,
  Icon,
  ListItem,
  Text,
  navigateToDetail,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'wouter'

interface Props {
  resource?: Customer
}

function ListItemCustomerComponent({
  resource = makeCustomer()
}: Props): JSX.Element {
  const [, setLocation] = useLocation()

  return (
    <ListItem
      tag='a'
      icon={<AvatarLetter text={resource.email} />}
      {...navigateToDetail({
        setLocation,
        destination: {
          app: 'customers',
          resourceId: resource.id
        }
      })}
    >
      <div>
        <Text tag='div' weight='semibold'>
          {resource.email}
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          {resource.total_orders_count ?? 0} orders
          {!isEmpty(resource.customer_group)
            ? ` · ${resource.customer_group?.name}`
            : ''}
        </Text>
      </div>
      <Icon name='caretRight' />
    </ListItem>
  )
}

export const ListItemCustomer = withSkeletonTemplate(ListItemCustomerComponent)
