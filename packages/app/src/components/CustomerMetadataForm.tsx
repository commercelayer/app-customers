import { Button, Legend, Spacer } from '@commercelayer/app-elements'
import {
  Form,
  InputMetadata,
  ValidationApiError
} from '@commercelayer/app-elements-hook-form'
import { type Metadata } from '@commercelayer/sdk/lib/cjs/resource'
import { useForm, type UseFormSetError } from 'react-hook-form'

export interface CustomerMetadataFormValues {
  metadata: Metadata
}

interface Props {
  defaultValues: CustomerMetadataFormValues
  isSubmitting: boolean
  onSubmit: (
    formValues: CustomerMetadataFormValues,
    setError: UseFormSetError<CustomerMetadataFormValues>
  ) => void
  apiError?: any
}

export function CustomerMetadataForm({
  defaultValues,
  onSubmit,
  apiError,
  isSubmitting
}: Props): JSX.Element {
  const methods = useForm({
    defaultValues
  })

  return (
    <Form
      {...methods}
      onSubmit={(formValues) => {
        onSubmit(formValues, methods.setError)
      }}
    >
      <Spacer bottom='12'>
        <Legend title='Metadata' />
        <InputMetadata name='metadata' />
      </Spacer>

      <Button type='submit' disabled={isSubmitting} className='w-full'>
        Update
      </Button>
      <ValidationApiError apiError={apiError} />
    </Form>
  )
}
