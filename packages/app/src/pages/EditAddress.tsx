import { AddressForm, type AddressFormValues } from '#components/AddressForm'
import { ScrollToTop } from '#components/ScrollToTop'
import { appRoutes } from '#data/routes'
import { isMock, makeCustomer } from '#mocks'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import {
  type Address,
  type AddressUpdate,
  type Customer
} from '@commercelayer/sdk'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function EditAddress(): JSX.Element {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ customerId: string; addressId: string }>(
    appRoutes.editAddress.path
  )

  const [customer, setCustomer] = useState<Customer | null>(makeCustomer())
  const [apiError, setApiError] = useState<any>()
  const [isSaving, setIsSaving] = useState(false)
  const isLoading = useMemo(
    () => customer != null && isMock(customer),
    [customer]
  )

  const customerId = params?.customerId
  const addressId = params?.addressId
  const goBackUrl =
    customerId != null
      ? appRoutes.details.makePath(customerId)
      : appRoutes.listAll.makePath()

  useEffect(() => {
    if (customerId != null) {
      sdkClient.customers
        .retrieve(customerId, {
          include: ['customer_addresses', 'customer_addresses.address']
        })
        .then(setCustomer)
        .catch(() => {
          setCustomer(null)
        })
    }
  }, [customerId])

  const { address } = getAddressById(customer, addressId)
  const isInvalidAddress = !isLoading && address == null

  if (isInvalidAddress || !canUser('update', 'addresses')) {
    return (
      <PageLayout
        title='Edit address'
        onGoBack={() => {
          setLocation(goBackUrl)
        }}
      >
        <EmptyState
          title='Not found'
          description='Address is invalid or you are not authorized to access this page.'
          action={
            <Link href={goBackUrl}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={
        <SkeletonTemplate isLoading={isLoading}>Edit address</SkeletonTemplate>
      }
      onGoBack={() => {
        setLocation(goBackUrl)
      }}
    >
      <ScrollToTop />
      <Spacer bottom='14'>
        {address != null ? (
          <AddressForm
            defaultValues={adaptAddressToFormValues(address)}
            showBillingInfo
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              void sdkClient.addresses
                .update(adaptFormValuesToAddress(formValues, address.id))
                .then(() => {
                  setLocation(goBackUrl)
                })
                .catch((error) => {
                  setApiError(error)
                  setIsSaving(false)
                })
            }}
          />
        ) : null}
      </Spacer>
    </PageLayout>
  )
}

function adaptAddressToFormValues(address?: Address): AddressFormValues {
  return {
    first_name: address?.first_name ?? '',
    last_name: address?.last_name ?? '',
    company: address?.company ?? '',
    line_1: address?.line_1 ?? '',
    line_2: address?.line_2 ?? '',
    city: address?.city ?? '',
    zip_code: address?.zip_code ?? '',
    state_code: address?.state_code ?? '',
    country_code: address?.country_code ?? '',
    phone: address?.phone ?? '',
    billing_info: address?.billing_info ?? ''
  }
}

function adaptFormValuesToAddress(
  formValues: AddressFormValues,
  addressId: string
): AddressUpdate {
  return {
    id: addressId,
    ...formValues
  }
}

function getAddressById(
  customer: Customer | null,
  addressId?: string
): {
  address?: Address | null
} {
  if (customer == null) {
    return {}
  }

  const address = customer?.customer_addresses?.filter(
    (customerAddress) => customerAddress.id === addressId
  )[0]?.address

  return {
    address
  }
}
