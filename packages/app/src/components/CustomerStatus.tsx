import {
  Spacer,
  Stack,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer } from '@commercelayer/sdk'

interface Props {
  customer: Customer
}

function getOrdersCount(customer: Customer): number {
  return customer.orders?.length ?? 0
}

export const CustomerStatus = withSkeletonTemplate<Props>(
  ({ customer }): JSX.Element => {
    return (
      <Stack>
        <div>
          <Spacer bottom='2'>
            <Text size='regular' tag='div' variant='info'>
              Orders
            </Text>
          </Spacer>
          <Text weight='semibold' className='text-lg'>
            {getOrdersCount(customer)}
          </Text>
        </div>
        <div>
          <Spacer bottom='2'>
            <Text size='regular' tag='div' variant='info'>
              Type
            </Text>
          </Spacer>
          <Text weight='semibold' className='text-lg'>
            {customer?.has_password === true ? 'Registered' : 'Guest'}
          </Text>
        </div>
      </Stack>
    )
  }
)
