import {
  Button,
  EmptyState,
  PageLayout,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

import {
  CustomerMetadataForm,
  type CustomerMetadataFormValues
} from '#components/CustomerMetadataForm'
import { ScrollToTop } from '#components/ScrollToTop'
import { appRoutes } from '#data/routes'
import { useCustomerDetails } from '#hooks/useCustomerDetails'
import type { Customer, CustomerUpdate } from '@commercelayer/sdk'

export function EditMetadata(): JSX.Element {
  const { canUser } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ customerId: string }>(
    appRoutes.editMetaData.path
  )
  const customerId = params?.customerId ?? ''
  const { customer, isLoading, mutateCustomer } = useCustomerDetails(customerId)
  const [apiError, setApiError] = useState<any>()
  const [isSaving, setIsSaving] = useState(false)

  const goBackUrl =
    customerId != null
      ? appRoutes.details.makePath(customerId)
      : appRoutes.list.makePath()

  if (!canUser('update', 'customers')) {
    return (
      <PageLayout
        title='Edit customer'
        onGoBack={() => {
          setLocation(goBackUrl)
        }}
      >
        <EmptyState
          title='Not found'
          description='Customer is invalid or you are not authorized to access this page.'
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
      title={<>{customer.email}</>}
      onGoBack={() => {
        setLocation(goBackUrl)
      }}
    >
      <ScrollToTop />
      <Spacer bottom='14'>
        {!isLoading && customer != null ? (
          <CustomerMetadataForm
            defaultValues={adaptCustomerToFormValues(customer)}
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              void sdkClient.customers
                .update(adaptFormValuesToCustomer(formValues, customer.id))
                .then((updatedCustomer) => {
                  setLocation(goBackUrl)
                  void mutateCustomer({ ...updatedCustomer })
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

function adaptCustomerToFormValues(
  customer?: Customer
): CustomerMetadataFormValues {
  return {
    metadata: customer?.metadata ?? {}
  }
}

function adaptFormValuesToCustomer(
  formValues: CustomerMetadataFormValues,
  customerId: string
): CustomerUpdate {
  return {
    id: customerId,
    metadata: formValues.metadata
  }
}
