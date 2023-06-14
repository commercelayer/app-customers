import { FiltersNav } from '#components/FiltersNav'
import { ListEmptyState } from '#components/ListEmptyState'
import { ListItemCustomer } from '#components/ListItemCustomer'
import { filtersAdapters, getActiveFilterCountFromUrl } from '#data/filters'
import { filtersByListType, type ListType } from '#data/lists'
import { appRoutes } from '#data/routes'
import {
  PageLayout,
  ResourceList,
  SearchBar,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { type QueryParamsList } from '@commercelayer/sdk'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { navigate, useSearch } from 'wouter/use-location'

interface Props {
  type: ListType
}

const pageTitle: Record<ListType, string> = {
  all: 'Customers'
}

export function CustomerList({ type }: Props): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const search = useSearch()
  const [, setLocation] = useLocation()
  const [sdkQuery, setSdkQuery] = useState<QueryParamsList>()

  const showFilters = type === 'all'
  const showSearchBar = type === 'all'
  const isUserFiltered = getActiveFilterCountFromUrl({ includeText: true }) > 0

  useEffect(() => {
    const filters = showFilters
      ? filtersAdapters.fromUrlQueryToSdk(search)
      : showSearchBar
      ? filtersAdapters.fromFormValuesToSdk({
          ...filtersByListType.all,
          text: filtersAdapters.fromUrlQueryToFormValues(search).text
        })
      : filtersAdapters.fromFormValuesToSdk(filtersByListType[type])

    setSdkQuery(buildListQuery(filters))
  }, [search])

  const updateTextFilter = (hint?: string): void => {
    const currentFilters = filtersAdapters.fromUrlQueryToFormValues(search)
    const newQueryString = filtersAdapters.fromFormValuesToUrlQuery({
      ...currentFilters,
      text: isEmpty(hint?.trim()) ? undefined : hint
    })
    navigate(`?${newQueryString}`, {
      replace: true
    })
  }

  if (sdkQuery == null) {
    return <div />
  }

  const onGoBack =
    type === 'all'
      ? () => {
          window.location.href =
            dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
        }
      : () => {
          setLocation(appRoutes.listAll.makePath())
        }

  return (
    <PageLayout
      title={pageTitle[type]}
      mode={mode}
      onGoBack={onGoBack}
      gap={showFilters ? 'only-top' : undefined}
    >
      {showFilters || showSearchBar ? (
        <Spacer top='4' bottom='14'>
          {showSearchBar && (
            <Spacer bottom='2'>
              <SearchBar
                placeholder='Search...'
                initialValue={
                  filtersAdapters.fromUrlQueryToFormValues(search).text
                }
                onClear={updateTextFilter}
                onSearch={updateTextFilter}
              />
            </Spacer>
          )}
          {showFilters && <FiltersNav />}
        </Spacer>
      ) : null}

      <Spacer bottom='14'>
        <ResourceList
          sdkClient={sdkClient}
          title={isUserFiltered ? 'Results' : 'All customers'}
          type='customers'
          query={sdkQuery}
          emptyState={
            <ListEmptyState scope={isUserFiltered ? 'filters' : 'list'} />
          }
          Item={ListItemCustomer}
        />
      </Spacer>
    </PageLayout>
  )
}

function buildListQuery(filters: QueryFilter): QueryParamsList {
  return {
    fields: {
      customers: [
        'id',
        'email',
        'created_at',
        'updated_at',
        'customer_group',
        'orders'
      ]
    },
    include: ['orders', 'customer_group'],
    pageSize: 25,
    filters,
    sort: {
      created_at: 'desc'
    }
  }
}
