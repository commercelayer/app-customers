import { appRoutes } from '#data/routes'
import {
  A,
  Legend,
  ListItem,
  Text,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Customer, CustomerAddress } from '@commercelayer/sdk'
import { Link } from 'wouter'

interface Props {
  customer: Customer
}

function renderAddress({
  label,
  customerAddress,
  editUrl,
  showBillingInfo
}: {
  label: string
  customerAddress: CustomerAddress | undefined | null
  editUrl?: string
  showBillingInfo?: boolean
}): JSX.Element | null {
  const address = customerAddress?.address
  if (address != null) {
    return (
      <ListItem tag='div' alignItems='top'>
        <div>
          <Text tag='div' weight='bold'>
            {label}
          </Text>
          <Text tag='div' variant='info'>
            {address.line_1} {address.line_2}
            <br />
            {address.city} {address.state_code} {address.zip_code} (
            {address.country_code})
          </Text>
          <Text tag='div' variant='info'>
            {address.phone}
          </Text>
          {address.billing_info != null && showBillingInfo === true ? (
            <Text tag='div' variant='info'>
              {address.billing_info}
            </Text>
          ) : null}
        </div>
        {editUrl != null ? (
          <Link href={editUrl}>
            <A>Edit</A>
          </Link>
        ) : null}
      </ListItem>
    )
  }
  return <></>
}

export const CustomerAddresses = withSkeletonTemplate<Props>(
  ({ customer }): JSX.Element | null => {
    const { canUser } = useTokenProvider()

    const makeEditUrl = (addressId?: string): string | undefined =>
      addressId != null && canUser('update', 'addresses')
        ? appRoutes.editAddress.makePath(customer.id, addressId)
        : undefined

    const addresses = customer.customer_addresses?.map(
      (customerAddress, idx) => (
        <div key={idx}>
          {renderAddress({
            label: customerAddress?.address?.full_name as string,
            customerAddress,
            editUrl: makeEditUrl(customerAddress?.id),
            showBillingInfo: true
          })}
        </div>
      )
    )

    if (addresses?.length === 0) return <></>

    return (
      <>
        <Legend title='Addresses' />
        {addresses}
      </>
    )
  }
)
