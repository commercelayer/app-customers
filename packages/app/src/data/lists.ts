import { type FilterFormValues } from '#data/filters'

export type ListType = 'all'

export const filtersByListType: Record<ListType, FilterFormValues> = {
  all: {
    customerGroup: [],
    status: [],
    type: []
  }
}
