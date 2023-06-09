import { useCoreApi } from '@commercelayer/app-elements'
import type { Order } from '@commercelayer/sdk'
import type { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'

interface UseCustomerOrdersDetailsSettings {
  pageNumber?: number
  pageSize?: number
}

export function useCustomerOrdersDetails(
  id: string,
  settings?: UseCustomerOrdersDetailsSettings
): {
  orders: ListResponse<Order> | undefined
  isLoading: boolean
} {
  const pageNumber = settings?.pageNumber ?? 1
  const pageSize = settings?.pageSize ?? 25

  const { data: orders, isLoading } = useCoreApi('customers', 'orders', [
    id,
    {
      filters: { status_matches_any: 'placed,approved,cancelled' },
      sort: ['-created_at'],
      pageNumber,
      pageSize
    },
    {}
  ])

  return { orders, isLoading }
}
