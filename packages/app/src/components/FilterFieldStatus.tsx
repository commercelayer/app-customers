import { getCustomerStatusName } from '#data/dictionaries'
import {
  computeFilterLabel,
  filterableStatus,
  type FilterFormValues
} from '#data/filters'
import { ToggleButtons } from '@commercelayer/app-elements-hook-form'
import { useFormContext } from 'react-hook-form'

export function FilterFieldStatus(): JSX.Element {
  const { watch } = useFormContext<FilterFormValues>()
  const selectedCount = watch().status.length

  return (
    <ToggleButtons
      label={computeFilterLabel({
        label: 'Status',
        selectedCount,
        totalCount: filterableStatus.length
      })}
      name='status'
      mode='multi'
      options={filterableStatus.map((status) => ({
        label: getCustomerStatusName(status),
        value: status
      }))}
    />
  )
}
