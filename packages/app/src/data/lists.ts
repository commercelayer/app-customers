import type { FormFullValues } from '@commercelayer/app-elements/dist/src/ui/resources/useResourceFilters/types'

export type ListType = 'all'

export const presets: Record<ListType, FormFullValues> = {
  all: {
    customerGroup: [],
    status: [],
    type: []
  }
}
