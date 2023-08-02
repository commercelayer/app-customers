import type { FiltersInstructions } from '@commercelayer/app-elements-hook-form/dist/filters/methods/types'

export const instructions: FiltersInstructions = [
  {
    label: 'Groups',
    type: 'options',
    sdk: {
      predicate: 'customer_group_id_in'
    },
    render: {
      component: 'relationshipSelector',
      props: {
        fieldForLabel: 'name',
        fieldForValue: 'id',
        resource: 'customer_groups',
        searchBy: 'name_cont',
        sortBy: { attribute: 'name', direction: 'asc' },
        previewLimit: 5
      }
    }
  },
  {
    label: 'Status',
    type: 'options',
    sdk: {
      predicate: 'status_in',
      defaultOptions: ['prospect', 'acquired', 'repeat']
    },
    render: {
      component: 'toggleButtons',
      props: {
        mode: 'multi',
        options: [
          { value: 'prospect', label: 'Prospect' },
          { value: 'acquired', label: 'Acquired' },
          { value: 'repeat', label: 'Repeat' }
        ]
      }
    }
  },
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: ['email', 'customer_group_name'].join('_or_') + '_cont'
    },
    render: {
      component: 'searchBar'
    }
  }
]
