import { FilterFieldCustomerGroup } from '#components/FilterFieldCustomerGroup'
import { FilterFieldStatus } from '#components/FilterFieldStatus'
import { FilterFieldType } from '#components/FilterFieldType'
import { filtersAdapters, type FilterFormValues } from '#data/filters'
import { appRoutes } from '#data/routes'
import { Button, PageLayout, Spacer } from '@commercelayer/app-elements'
import { Form } from '@commercelayer/app-elements-hook-form'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'

export function Filters(): JSX.Element {
  const [, setLocation] = useLocation()

  const methods = useForm<FilterFormValues>({
    defaultValues: filtersAdapters.fromUrlQueryToFormValues(location.search)
  })

  return (
    <PageLayout
      title='Filters'
      onGoBack={() => {
        setLocation(
          appRoutes.list.makePath(
            filtersAdapters.fromUrlQueryToUrlQuery(location.search)
          )
        )
      }}
    >
      <Form
        {...methods}
        onSubmit={(formValues) => {
          setLocation(
            appRoutes.list.makePath(
              filtersAdapters.fromFormValuesToUrlQuery(formValues)
            )
          )
        }}
      >
        <Spacer bottom='14'>
          <FilterFieldCustomerGroup />
        </Spacer>

        <Spacer bottom='14'>
          <FilterFieldStatus />
        </Spacer>

        <Spacer bottom='14'>
          <FilterFieldType />
        </Spacer>

        <Spacer bottom='14'>
          <Button type='submit' className='w-full'>
            Apply filters
          </Button>
        </Spacer>
      </Form>
    </PageLayout>
  )
}
