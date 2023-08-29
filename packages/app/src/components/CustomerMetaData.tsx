import { appRoutes } from '#data/routes'
import {
  Legend,
  ListItemsMetadata,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer } from '@commercelayer/sdk'
import { isObject } from 'lodash'
import { Link } from 'wouter'

interface Props {
  customer: Customer
}

export const CustomerMetaData = withSkeletonTemplate<Props>(
  ({ customer }): JSX.Element | null => {
    const customerHasMetadata =
      isObject(customer.metadata) && Object.keys(customer.metadata).length > 0

    if (!customerHasMetadata) return <></>

    return (
      <>
        <Legend
          title='Metadata'
          actionButton={
            <div className='pr-4'>
              <Link href={appRoutes.editMetaData.makePath(customer.id)}>
                <a>Edit</a>
              </Link>
            </div>
          }
        />
        <ListItemsMetadata metadata={customer.metadata} />
      </>
    )
  }
)
