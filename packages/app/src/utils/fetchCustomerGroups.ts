import type { CommerceLayerClient, CustomerGroup } from '@commercelayer/sdk'
import type { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'

export async function fetchCustomerGroups({
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
