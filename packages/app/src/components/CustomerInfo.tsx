import {
  Legend,
  ListItem,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer } from '@commercelayer/sdk'

interface Props {
  customer: Customer
}

export const CustomerInfo = withSkeletonTemplate<Props>(
  ({ customer }): JSX.Element => {
    return (
      <>
        <Legend title='Info' />
        <ListItem tag='div'>
          <Text tag='div' variant='info'>
            Status
          </Text>
          <Text tag='div' weight='semibold' className='capitalize'>
            {customer?.status}
          </Text>
        </ListItem>
        <ListItem tag='div'>
          <Text tag='div' variant='info'>
            Group
          </Text>
          <Text tag='div' weight='semibold' className='capitalize'>
            {customer?.customer_group?.name ?? '-'}
          </Text>
        </ListItem>
      </>
    )
  }
)
