import {
  Button,
  Spacer,
  Text,
  useCoreSdkProvider
} from '@commercelayer/app-elements'
import {
  Form,
  Input,
  InputSelect,
  ValidationApiError
} from '@commercelayer/app-elements-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { z } from 'zod'

import { fetchCustomerGroups } from '#utils/fetchCustomerGroups'

import type { CustomerGroup } from '@commercelayer/sdk'
import type { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'

const customerFormSchema = z.object({
  email: z.string().email(),
  customerGroup: z.string().nullable()
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>

interface Props {
  defaultValues: CustomerFormValues
  isSubmitting?: boolean
  onSubmit: (
    formValues: CustomerFormValues,
    setError: UseFormSetError<CustomerFormValues>
  ) => void
  apiError?: any
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  apiError,
  isSubmitting
}: Props): JSX.Element {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(customerFormSchema)
  })

  const { sdkClient } = useCoreSdkProvider()
  const [fetchedCustomerGroups, setFetchedCustomerGroups] =
    useState<ListResponse<CustomerGroup>>()

  useEffect(() => {
    if (sdkClient != null) {
      void fetchCustomerGroups({
        sdkClient
      }).then(setFetchedCustomerGroups)
    }
  }, [sdkClient])

  return (
    <Form
      {...methods}
      onSubmit={(formValues) => {
        onSubmit(formValues, methods.setError)
      }}
    >
      <Spacer bottom='8'>
        <Input
          name='email'
          label='Email'
          hint={{
            text: <Text variant='info'>The customer's email address</Text>
          }}
        />
      </Spacer>

      {fetchedCustomerGroups != null && (
        <Spacer bottom='8'>
          <Select options={fetchedCustomerGroups} />
        </Spacer>
      )}

      <Spacer top='14'>
        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {defaultValues.email.length === 0 ? 'Create' : 'Update'} customer
        </Button>
        <ValidationApiError apiError={apiError} />
      </Spacer>
    </Form>
  )
}

function Select({ options }: { options: CustomerGroup[] }): JSX.Element | null {
  const { sdkClient } = useCoreSdkProvider()

  return (
    <InputSelect
      label='Group'
      name='customerGroup'
      initialValues={options.map((customerGroup) => ({
        value: customerGroup.id,
        label: customerGroup.name
      }))}
      isClearable
      pathToValue='value'
      loadAsyncValues={async (hint) => {
        const list = await fetchCustomerGroups({ sdkClient, hint })
        return list.map((customerGroup) => ({
          value: customerGroup.id,
          label: customerGroup.name
        }))
      }}
      hint={{
        text: (
          <Text variant='info'>The group to which this customer belongs</Text>
        )
      }}
    />
  )
}
