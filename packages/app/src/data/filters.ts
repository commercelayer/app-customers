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
    label: 'Type',
    type: 'options',
    sdk: {
      predicate: 'password_present',
      parseFormValue: (value) =>
        !!(
          Array.isArray(value) &&
          value.length === 1 &&
          value[0] === 'registered'
        )
    },
    /* ...(type.length === 0 || type.length > 1
      ? {}
      : {
          [`password${type[0] === 'registered' ? '_present' : '_blank'}`]: true
        }), */
    render: {
      component: 'toggleButtons',
      props: {
        mode: 'multi',
        options: [
          { value: 'guest', label: 'Guest' },
          { value: 'registered', label: 'Registered' }
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
