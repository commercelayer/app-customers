import { type Customer } from '@commercelayer/sdk'
import type { QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import castArray from 'lodash/castArray'
import compact from 'lodash/compact'
import isBoolean from 'lodash/isBoolean'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import queryString, { type ParsedQuery } from 'query-string'

export const filterableStatus: Array<Customer['status']> = [
  'prospect',
  'acquired',
  'repeat'
]

export type FilterableType = 'guest' | 'registered'
export const filterableType: FilterableType[] = ['guest', 'registered']

export interface FilterFormValues {
  customerGroup: string[]
  status: typeof filterableStatus
  type: typeof filterableType
  text?: string
}

const textRansack = ['email', 'customer_group_name'].join('_or_') + '_cont'

/**
 * Covert FilterFormValues in url query string
 * @param formValues a valid FilterFormValues object
 * @returns a string ready to be used in URL
 */
function fromFormValuesToUrlQuery(formValues: FilterFormValues): string {
  return queryString.stringify(
    omitBy(
      {
        ...formValues
      },
      isEmpty
    )
  )
}

/**
 * Covert query string in filters form values
 * @param qs url query string
 * @returns an object containing FilterFormValues
 */
function fromUrlQueryToFormValues(qs: string): FilterFormValues {
  const parsedQuery = queryString.parse(qs)
  const { customerGroup, status, type, text } = parsedQuery

  // parse a single filter key value to return
  // an array of valid values or an empty array
  const parseQueryStringValueAsArray = <TFiltrableValue extends string>(
    value?: ParsedQuery[string],
    acceptedValues?: Readonly<TFiltrableValue[]>
  ): TFiltrableValue[] => {
    if (value == null) {
      return []
    }
    const cleanValue = compact(castArray(value) as TFiltrableValue[])
    if (acceptedValues != null) {
      return cleanValue.filter((v) => acceptedValues.includes(v))
    }
    return cleanValue
  }

  const formValues: FilterFormValues = {
    customerGroup: parseQueryStringValueAsArray(customerGroup),
    status: parseQueryStringValueAsArray(status, filterableStatus),
    type: parseQueryStringValueAsArray(type, filterableType),
    text: parseQueryStringValueAsArray(text)[0]
  }

  return formValues
}

/**
 * Covert FilterFormValues in SDK filter object
 * @param formValues a valid FilterFormValues object
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
function fromFormValuesToSdk(formValues: FilterFormValues): QueryFilter {
  const { customerGroup, status, type, text } = formValues

  const sdkFilters: Partial<QueryFilter> = {
    customer_group_id_in: castArray(customerGroup).join(','),
    status_in: status.join(','),
    ...(type.length === 0 || type.length > 1
      ? {}
      : {
          [`password${type[0] === 'registered' ? '_present' : '_blank'}`]: true
        }),
    ...(isEmpty(text) ? {} : { [textRansack]: text })
  }

  // stripping out empty or undefined values
  const noEmpty = omitBy(
    sdkFilters,
    (v) => isEmpty(v) && !isBoolean(v)
  ) as QueryFilter

  // enforce default status_in when not set, to prevent listing draft or pending
  return enforceDefaultStatusIn(noEmpty)
}

/**
 * Covert URL query string in SDK filter object
 * @param qs url query string
 * @returns an object of type QueryFilter to be used in the SDK
 * stripping out empty or undefined values and enforcing default status_in when empty
 */
function fromUrlQueryToSdk(qs: string): QueryFilter {
  return fromFormValuesToSdk(fromUrlQueryToFormValues(qs))
}

/**
 * Parse current URL query string to return a new query string that contains only valid form values
 * @param qs url query string
 * @returns an object of type QueryFilter to be used in the SDK stripping out empty or undefined values
 */
function fromUrlQueryToUrlQuery(qs: string): string {
  return fromFormValuesToUrlQuery(fromUrlQueryToFormValues(qs))
}

/**
 * Contains all methods to transform and parse filter values in different formats
 * since filters can be expressed as
 * - App form UI state (FilterFormValues)
 * - URL query string (string)
 * - SDK filter object (QueryFilter)
 */
export const filtersAdapters = {
  fromFormValuesToUrlQuery,
  fromFormValuesToSdk,
  fromUrlQueryToFormValues,
  fromUrlQueryToSdk,
  fromUrlQueryToUrlQuery
}

/**
 * Be sure to have a status_in filter with all the default values
 * to prevent listing draft or pending orders
 */
export function enforceDefaultStatusIn(filters: QueryFilter): QueryFilter {
  return isEmpty(filters.status_in)
    ? {
        ...filters,
        status_in: filterableStatus.join(',')
      }
    : filters
}

/**
 * Show the filter label with the counter for selected options
 * or just the total of available options when nothing is selected
 * @param options
 * @returns string
 *
 * @example
 * "Markets · 2 of 4"
 * "Markets · 4"
 */
export function computeFilterLabel({
  label,
  totalCount,
  selectedCount
}: {
  label: string
  totalCount: number
  selectedCount: number
}): string {
  const counter =
    selectedCount > 0 ? `${selectedCount} of ${totalCount}` : totalCount
  return `${label} · ${counter}`
}

/**
 * Get total count of active filter groups from URL query string.
 * @param includeText if `true` will count `text` filter as active filter group
 * @returns number of active filters
 * Example: if we have 3 markets selected, will still count as `1` active filter group
 * If we have 3 markets and 1 status selected, will count as `2`.
 */
export function getActiveFilterCountFromUrl({
  includeText = false
}: {
  includeText?: boolean
}): number {
  const toCount = filtersAdapters.fromUrlQueryToFormValues(location.search)
  if (!includeText) {
    delete toCount.text
  }
  // timeFrom and timeTo will be omitted because Date is consider as empty/non-iterable object
  const nonEmptyFilter = omitBy<FilterFormValues>(toCount, isEmpty)
  return Object.keys(nonEmptyFilter).length
}
