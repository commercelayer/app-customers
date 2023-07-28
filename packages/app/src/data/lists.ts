import type { FormFullValues } from '@commercelayer/app-elements-hook-form/dist/filters/methods/types'

export type ListType = 'all'

export const presets: Record<ListType, FormFullValues> = {
  all: {
    customerGroup: [],
    status: [],
    type: []
  }
}
