import { ListEmptyState } from '#components/ListEmptyState'
import { ListItemCustomer } from '#components/ListItemCustomer'
import { instructions } from '#data/filters'
import { presets, type ListType } from '#data/lists'
import { appRoutes } from '#data/routes'
import {
  PageLayout,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useFilters } from '@commercelayer/app-elements-hook-form'
import { Link, useLocation } from 'wouter'
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
    settings: { mode },
    canUser
  } = useTokenProvider()

  const queryString = useSearch()
  const [, setLocation] = useLocation()

  const { SearchWithNav, FilteredList, viewTitle, hasActiveFilter } =
    useFilters({
      instructions
    })

  const isUserCustomFiltered =
    hasActiveFilter && viewTitle === presets.all.viewTitle
  const hideFiltersNav = !(
    viewTitle == null || viewTitle === presets.all.viewTitle
  )

  const onGoBack =
    type === 'all'
      ? () => {
          window.location.href =
            dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
        }
      : () => {
          setLocation(appRoutes.list.makePath())
        }

  return (
    <PageLayout
      title={pageTitle[type]}
      mode={mode}
      onGoBack={onGoBack}
      gap='only-top'
    >
      <SearchWithNav
        queryString={queryString}
        onUpdate={(qs) => {
          navigate(`?${qs}`, {
            replace: true
          })
        }}
        onFilterClick={(queryString) => {
          setLocation(appRoutes.filters.makePath(queryString))
        }}
        hideFiltersNav={hideFiltersNav}
      />

      <Spacer bottom='14'>
        <FilteredList
          type='customers'
          Item={ListItemCustomer}
          query={{
            fields: {
              customers: [
                'id',
                'email',
                'total_orders_count',
                'created_at',
                'updated_at',
                'customer_group'
              ]
            },
            include: ['customer_group'],
            pageSize: 25,
            sort: {
              updated_at: 'desc'
            }
          }}
          emptyState={
            <ListEmptyState
              scope={
                isUserCustomFiltered
                  ? 'userFiltered'
                  : viewTitle !== presets.all.viewTitle
                  ? 'presetView'
                  : 'history'
              }
            />
          }
          actionButton={
            canUser('create', 'customers') ? (
              <Link href={appRoutes.new.makePath()}>
                <a>Add new</a>
              </Link>
            ) : undefined
          }
        />
      </Spacer>
    </PageLayout>
  )
}
