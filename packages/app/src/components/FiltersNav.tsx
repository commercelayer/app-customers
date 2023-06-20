import { getCustomerStatusName } from '#data/dictionaries'
import {
  filtersAdapters,
  getActiveFilterCountFromUrl,
  type FilterFormValues
} from '#data/filters'
import { appRoutes } from '#data/routes'
import {
  ButtonFilter,
  SkeletonTemplate,
  useCoreSdkProvider
} from '@commercelayer/app-elements'
import { type CustomerGroup } from '@commercelayer/sdk'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { navigate, useSearch } from 'wouter/use-location'

export function FiltersNav(): JSX.Element {
  const [, setLocation] = useLocation()
  const search = useSearch()
  const filters = useMemo(
    () => filtersAdapters.fromUrlQueryToFormValues(search),
    [search]
  )

  const activeGroupCount = getActiveFilterCountFromUrl({ includeText: false })

  const selectedCustomerGroups = filters?.customerGroup ?? []
  const selectedStatus = filters?.status ?? []

  const { sdkClient } = useCoreSdkProvider()
  const [isLoading, setIsLoading] = useState(true)
  const [customerGroupDetail, setCustomerGroupDetail] =
    useState<CustomerGroup>()

  const updateQueryString = (qs: string): void => {
    navigate(`?${qs}`)
  }

  const navigateToFiltersEdit = (): void => {
    setLocation(
      appRoutes.filters.makePath(
        filtersAdapters.fromUrlQueryToUrlQuery(location.search)
      )
    )
  }

  const removeSingleFilterGroup = (filterKey: keyof FilterFormValues): void => {
    updateQueryString(
      filtersAdapters.fromFormValuesToUrlQuery({
        ...filters,
        [filterKey]: []
      })
    )
  }

  const removeAllFilters = (): void => {
    // keep the text filter when removing all filters
    const currentFilters = filtersAdapters.fromUrlQueryToFormValues(search)
    const emptyFilters = filtersAdapters.fromUrlQueryToFormValues('')
    updateQueryString(
      filtersAdapters.fromFormValuesToUrlQuery({
        ...emptyFilters,
        text: currentFilters.text
      })
    )
  }

  useEffect(
    function fetchSingleCustomerGroup() {
      if (
        selectedCustomerGroups.length === 1 &&
        selectedCustomerGroups[0] != null
      ) {
        sdkClient.customer_groups
          .retrieve(selectedCustomerGroups[0], {
            fields: ['id', 'name']
          })
          .then(setCustomerGroupDetail)
          .finally(() => {
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    },
    [selectedCustomerGroups]
  )

  if (filters == null) {
    return <></>
  }

  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      {/* TODO: no css! */}
      <div className='flex gap-4 flex-wrap'>
        {/* Main filter button */}
        {activeGroupCount > 0 ? (
          <ButtonFilter
            label={`Filters · ${activeGroupCount}`}
            icon='funnel'
            onClick={navigateToFiltersEdit}
            onRemoveRequest={removeAllFilters}
          />
        ) : (
          <ButtonFilter
            label='Filters'
            icon='funnel'
            onClick={navigateToFiltersEdit}
          />
        )}

        {/* CustomerGroups */}
        {selectedCustomerGroups.length > 0 &&
        selectedCustomerGroups[0] != null ? (
          <ButtonFilter
            label={getButtonFilterLabel({
              list: selectedCustomerGroups,
              labelMultiItem: 'Customer groups',
              labelSingleItem:
                customerGroupDetail?.name ?? selectedCustomerGroups[0]
            })}
            onClick={navigateToFiltersEdit}
            onRemoveRequest={() => {
              removeSingleFilterGroup('customerGroup')
            }}
          />
        ) : null}

        {/* Status */}
        {selectedStatus.length > 0 && selectedStatus[0] != null ? (
          <ButtonFilter
            label={getButtonFilterLabel({
              list: selectedStatus,
              labelMultiItem: 'Status',
              labelSingleItem: getCustomerStatusName(selectedStatus[0])
            })}
            onClick={navigateToFiltersEdit}
            onRemoveRequest={() => {
              removeSingleFilterGroup('status')
            }}
          />
        ) : null}
      </div>
    </SkeletonTemplate>
  )
}

/**
 * Get label for ButtonFilter component.
 * If list has only one item, will use the first item in the list.
 * If list has more than one item, will use the labelMultiItem and append the count of items in the list.
 */
function getButtonFilterLabel({
  list,
  labelSingleItem,
  labelMultiItem
}: {
  /**
   * list of items/options active for the filter group
   */
  list: string[]
  /**
   * label to use when list has more than one item
   */
  labelMultiItem: string
  /**
   * optional label to use when list has only one item, will use the first item in the list if not provided
   * in this way we can handle the loading ui state with SkeletonTemplate
   */
  labelSingleItem: string
}): string {
  const firstItemLabel = labelSingleItem ?? list[0] ?? ''
  const groupLabelWithCount = `${labelMultiItem} · ${list.length}`

  return list.length === 1 ? firstItemLabel : groupLabelWithCount
}
