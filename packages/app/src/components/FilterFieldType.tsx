import { getCustomerTypeName } from '#data/dictionaries'
import {
  computeFilterLabel,
  filterableType,
  type FilterFormValues
} from '#data/filters'
import { ToggleButtons } from '@commercelayer/app-elements-hook-form'
import { useFormContext } from 'react-hook-form'

export function FilterFieldType(): JSX.Element {
  const { watch } = useFormContext<FilterFormValues>()
  const selectedCount = watch().type?.length ?? 0

  return (
    <ToggleButtons
      label={computeFilterLabel({
        label: 'Customer type',
        selectedCount,
        totalCount: filterableType.length
      })}
      name='type'
      mode='multi'
      options={filterableType.map((type) => ({
        label: getCustomerTypeName(type),
        value: type
      }))}
    />
  )
}
