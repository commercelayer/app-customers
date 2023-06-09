import { computeFilterLabel, type FilterFormValues } from '#data/filters'
import { makeCustomerGroup, repeat } from '#mocks'
import {
  AvatarLetter,
  Card,
  InputCheckbox,
  SkeletonTemplate,
  Spacer,
  Text,
  useCoreSdkProvider
} from '@commercelayer/app-elements'
import { InputSelect } from '@commercelayer/app-elements-hook-form'
import type { CommerceLayerClient, CustomerGroup } from '@commercelayer/sdk'
import type { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export function FilterFieldCustomerGroup(): JSX.Element {
  const { sdkClient } = useCoreSdkProvider()
  const [fetchedCustomerGroup, setFetchedCustomerGroup] = useState<
    ListResponse<CustomerGroup> | undefined
  >()

  useEffect(() => {
    if (sdkClient != null) {
      void fetchCustomerGroups({
        sdkClient
      }).then(setFetchedCustomerGroup)
    }
  }, [sdkClient])

  if (fetchedCustomerGroup === undefined) {
    return <List options={repeat(5, makeCustomerGroup)} isLoading />
  }

  return fetchedCustomerGroup.length > 5 ? (
    <Select options={fetchedCustomerGroup} />
  ) : (
    <List options={fetchedCustomerGroup} />
  )
}

function List({
  options,
  isLoading
}: {
  options: CustomerGroup[]
  isLoading?: boolean
}): JSX.Element {
  const { control, watch } = useFormContext<FilterFormValues>()
  const selectedCount = watch().customerGroup.length

  return (
    <div>
      <Spacer bottom='4'>
        <SkeletonTemplate isLoading={isLoading}>
          <Text variant='info' weight='medium'>
            {computeFilterLabel({
              label: 'Customer groups',
              selectedCount,
              totalCount: options.length
            })}
          </Text>
        </SkeletonTemplate>
      </Spacer>
      <Controller
        name='customerGroup'
        control={control}
        render={({ field }) => (
          <SkeletonTemplate isLoading={isLoading}>
            <Card>
              {options.map((customerGroup, idx) => {
                const hasBottomGap = idx + 1 < options.length
                const isChecked = field.value.includes(customerGroup.id)
                return (
                  <Spacer
                    key={customerGroup.id}
                    bottom={hasBottomGap ? '4' : undefined}
                  >
                    <InputCheckbox
                      checked={isChecked}
                      onChange={() => {
                        field.onChange(
                          isChecked
                            ? field.value.filter((v) => v !== customerGroup.id)
                            : [...field.value, customerGroup.id]
                        )
                      }}
                    >
                      <AvatarLetter text={customerGroup.name} />
                      <Text weight='semibold'>{customerGroup.name}</Text>
                    </InputCheckbox>
                  </Spacer>
                )
              })}
            </Card>
          </SkeletonTemplate>
        )}
      />
    </div>
  )
}

function Select({ options }: { options: CustomerGroup[] }): JSX.Element | null {
  const { sdkClient } = useCoreSdkProvider()

  if (sdkClient == null) {
    return null
  }

  return (
    <InputSelect
      label='Customer groups'
      name='customerGroup'
      initialValues={options.map((customerGroup) => ({
        value: customerGroup.id,
        label: customerGroup.name
      }))}
      placeholder='Type to search for customer group'
      isMulti
      isClearable
      pathToValue='value'
      loadAsyncValues={async (hint) => {
        const list = await fetchCustomerGroups({ sdkClient, hint })
        return list.map((customerGroup) => ({
          value: customerGroup.id,
          label: customerGroup.name
        }))
      }}
    />
  )
}

async function fetchCustomerGroups({
  hint,
  sdkClient
}: {
  hint?: string
  sdkClient: CommerceLayerClient
}): Promise<ListResponse<CustomerGroup>> {
  const list = await sdkClient.customer_groups.list({
    fields: ['id', 'name'],
    pageSize: 10,
    filters:
      hint != null
        ? {
            name_cont: hint
          }
        : undefined,
    sort: {
      name: 'asc'
    }
  })
  return list
}
