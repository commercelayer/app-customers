import { appRoutes } from '#data/routes'
import { makeCustomer } from '#mocks'
import {
  AvatarLetter,
  Icon,
  ListItem,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'wouter'

interface Props {
  resource?: Customer
}

function ListItemCustomerComponent({
  resource = makeCustomer()
}: Props): JSX.Element {
  return (
    <Link href={appRoutes.details.makePath(resource.id)}>
      <ListItem tag='a' icon={<AvatarLetter text={resource.email} />}>
        <div>
          <Text tag='div' weight='semibold'>
            {resource.email}
          </Text>
          <Text tag='div' weight='medium' size='small' variant='info'>
            {resource.orders?.length} orders
            {!isEmpty(resource.customer_group)
              ? ` · ${resource.customer_group?.name}`
              : ''}
          </Text>
        </div>
        <Icon name='caretRight' />
      </ListItem>
    </Link>
  )
}

export const ListItemCustomer = withSkeletonTemplate(ListItemCustomerComponent)
